<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\BvHistory;
use App\Models\MatchingIncomeReport;

class ProcessMonthlyMatchingIncome extends Command
{
    protected $signature = 'matching:process-monthly {--test : Run in test mode}';
    protected $description = 'Process monthly matching income for all eligible users';

    public function handle()
    {
        $testMode = $this->option('test');
        
        if ($testMode) {
            $this->info('Running in TEST mode - no actual processing');
        }
        
        $this->info('Starting monthly matching income processing...');
        
        // Get all users
        $users = User::all();
        $processedCount = 0;
        $totalBonusProcessed = 0;
        
        foreach ($users as $user) {
            try {
                $result = $this->processUserMatchingIncome($user, $testMode);
                
                if ($result['processed']) {
                    $processedCount++;
                    $totalBonusProcessed += $result['bonus'];
                    
                    $this->info("Processed: {$user->user_id} - Level {$result['level']} - Bonus: {$result['bonus']}");
                }
            } catch (\Exception $e) {
                $this->error("Error processing {$user->user_id}: " . $e->getMessage());
            }
        }
        
        $this->info("Matching income processing completed!");
        $this->info("Users processed: {$processedCount}");
        $this->info("Total bonus distributed: {$totalBonusProcessed}");
        
        return 0;
    }
    
    private function processUserMatchingIncome($user, $testMode = false)
    {
        $previousBv = $user->bv;
        $userLevel = $this->getUserMatchingLevel($user);
        
        $matchingPercentages = [
            1 => 10, 2 => 8, 3 => 6, 4 => 4
        ];
        
        $matchingPercentage = $matchingPercentages[$userLevel] ?? 0;
        
        if ($matchingPercentage == 0) {
            return ['processed' => false, 'reason' => 'Not eligible'];
        }
        
        $leftTeam = $user->leftChild ? $this->getAllDescendants($user->leftChild) : collect();
        $rightTeam = $user->rightChild ? $this->getAllDescendants($user->rightChild) : collect();
        
        if ($user->leftChild) $leftTeam->prepend($user->leftChild);
        if ($user->rightChild) $rightTeam->prepend($user->rightChild);
        
        $leftTotalBV = $leftTeam->sum('bv');
        $rightTotalBV = $rightTeam->sum('bv');
        $matchingBV = min($leftTotalBV, $rightTotalBV);
        
        if ($matchingBV <= 0) {
            return ['processed' => false, 'reason' => 'No matching BV'];
        }
        
        $matchingBonus = $matchingBV * ($matchingPercentage / 100);
        
        $matchingData = [
            'user_level' => $userLevel,
            'matching_percentage' => $matchingPercentage,
            'left_team_bv' => $leftTotalBV,
            'right_team_bv' => $rightTotalBV,
            'matching_bv' => $matchingBV,
            'bonus_calculated' => $matchingBonus,
            'left_team_count' => $leftTeam->count(),
            'right_team_count' => $rightTeam->count(),
            'processed_at' => now()
        ];
        
        if (!$testMode && $matchingBonus > 0) {
            $oldBv = $user->bv;
            $user->increment('bv', $matchingBonus);
            
            BvHistory::create([
                'user_id' => $user->user_id,
                'previous_bv' => $oldBv,
                'bv_change' => $matchingBonus,
                'new_bv' => $user->bv,
                'type' => 'credit',
                'reason' => 'matching_income_level_' . $userLevel,
                'reference_id' => 'matching_' . now()->format('Y_m'),
            ]);
            
            MatchingIncomeReport::create([
                'user_id' => $user->user_id,
                'total_bonus_credited' => $matchingBonus,
                'matching_data' => $matchingData,
                'previous_bv' => $previousBv,
                'new_bv' => $user->bv,
                'status' => 'completed',
                'processing_type' => 'production'
            ]);
        } elseif ($testMode && $matchingBonus > 0) {
            MatchingIncomeReport::create([
                'user_id' => $user->user_id,
                'total_bonus_credited' => $matchingBonus,
                'matching_data' => $matchingData,
                'previous_bv' => $previousBv,
                'new_bv' => $previousBv,
                'status' => 'test_mode',
                'processing_type' => 'test'
            ]);
        }
        
        return [
            'processed' => true,
            'level' => $userLevel,
            'bonus' => $matchingBonus,
            'matching_bv' => $matchingBV
        ];
    }
    
    private function getUserMatchingLevel($user)
    {
        $levelUsers = [];
        for ($level = 1; $level <= 4; $level++) {
            $levelUsers[$level] = $this->getUsersByLevel($user, $level);
        }
        
        $levelRequirements = [1 => 2, 2 => 4, 3 => 8, 4 => 16];
        
        for ($level = 4; $level >= 1; $level--) {
            if (count($levelUsers[$level]) >= $levelRequirements[$level]) {
                return $level;
            }
        }
        
        return 0;
    }
    
    private function getUsersByLevel($rootUser, $targetLevel)
    {
        $users = [];
        $this->collectUsersByLevel($rootUser, 0, $targetLevel, $users);
        return $users;
    }
    
    private function collectUsersByLevel($user, $currentLevel, $targetLevel, &$users)
    {
        if (!$user || $currentLevel > $targetLevel) {
            return;
        }
        
        if ($currentLevel === $targetLevel) {
            $users[] = $user;
            return;
        }
        
        $children = User::where('root_id', $user->user_id)->get();
        foreach ($children as $child) {
            $this->collectUsersByLevel($child, $currentLevel + 1, $targetLevel, $users);
        }
    }
    
    private function getAllDescendants($user)
    {
        $descendants = collect();
        
        if (!$user) {
            return $descendants;
        }
        
        $directChildren = User::where('root_id', $user->user_id)->get();
        
        foreach ($directChildren as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($this->getAllDescendants($child));
        }
        
        return $descendants;
    }
}