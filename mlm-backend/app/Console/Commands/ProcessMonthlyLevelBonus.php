<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\BvHistory;
use App\Models\LevelBonusReport;

class ProcessMonthlyLevelBonus extends Command
{
    protected $signature = 'mlm:process-monthly-level-bonus';
    protected $description = 'Process level bonuses for all eligible users at the end of the month';

    public function handle()
    {
        $this->info('Starting monthly level bonus processing...');
        
        $users = User::where('isActive', true)->get();
        $totalProcessed = 0;
        $totalBonusCredited = 0;

        foreach ($users as $user) {
            $bonusCredited = $this->processUserLevelBonus($user);
            if ($bonusCredited > 0) {
                $totalProcessed++;
                $totalBonusCredited += $bonusCredited;
                $this->info("Processed level bonus for user {$user->user_id}: {$bonusCredited} BV");
            }
        }

        $this->info("Monthly level bonus processing completed!");
        $this->info("Users processed: {$totalProcessed}");
        $this->info("Total bonus credited: {$totalBonusCredited} BV");
    }

    private function processUserLevelBonus($rootUser)
    {
        $previousBv = $rootUser->bv;
        $totalBonus = 0;
        $levelBonuses = [];
        
        $levelConfig = [
            1 => ['percentage' => 20, 'expected_count' => 2],
            2 => ['percentage' => 5, 'expected_count' => 4],
            3 => ['percentage' => 3, 'expected_count' => 8],
            4 => ['percentage' => 2, 'expected_count' => 16]
        ];
        
        for ($level = 1; $level <= 4; $level++) {
            $levelUsers = $this->getUsersByLevel($rootUser, $level);
            $config = $levelConfig[$level];
            
            if (count($levelUsers) >= $config['expected_count']) {
                $bvValues = array_map(function($user) { return $user->bv; }, $levelUsers);
                $minBv = min($bvValues);
                $bonus = $minBv * ($config['percentage'] / 100);
                
                if ($bonus > 0) {
                    $oldBv = $rootUser->bv;
                    $rootUser->increment('bv', $bonus);
                    $rootUser->refresh();
                    
                    BvHistory::create([
                        'user_id' => $rootUser->user_id,
                        'previous_bv' => $oldBv,
                        'bv_change' => $bonus,
                        'new_bv' => $rootUser->bv,
                        'type' => 'credit',
                        'reason' => 'monthly_level_bonus_level_' . $level,
                        'reference_id' => 'monthly_level_' . $level . '_' . date('Y_m'),
                    ]);
                    
                    $totalBonus += $bonus;
                    
                    $levelBonuses[] = [
                        'level' => $level,
                        'users_count' => count($levelUsers),
                        'expected_count' => $config['expected_count'],
                        'min_bv' => $minBv,
                        'percentage' => $config['percentage'],
                        'bonus' => $bonus,
                        'processed' => true,
                        'processed_at' => now()
                    ];
                } else {
                    $levelBonuses[] = [
                        'level' => $level,
                        'users_count' => count($levelUsers),
                        'expected_count' => $config['expected_count'],
                        'min_bv' => $minBv,
                        'percentage' => $config['percentage'],
                        'bonus' => 0,
                        'processed' => false,
                        'message' => 'No bonus due to zero BV'
                    ];
                }
            } else {
                $levelBonuses[] = [
                    'level' => $level,
                    'users_count' => count($levelUsers),
                    'expected_count' => $config['expected_count'],
                    'min_bv' => 0,
                    'percentage' => $config['percentage'],
                    'bonus' => 0,
                    'processed' => false,
                    'message' => 'Insufficient users at this level'
                ];
            }
        }
        
        // Create report if any bonus was processed
        if ($totalBonus > 0) {
            LevelBonusReport::create([
                'user_id' => $rootUser->user_id,
                'total_bonus_credited' => $totalBonus,
                'level_bonuses_data' => $levelBonuses,
                'previous_bv' => $previousBv,
                'new_bv' => $rootUser->bv,
                'status' => 'completed'
            ]);
        }
        
        return $totalBonus;
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
}