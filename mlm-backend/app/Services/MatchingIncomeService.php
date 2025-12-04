<?php

namespace App\Services;

use App\Models\User;
use App\Models\BvHistory;
use Carbon\Carbon;

class MatchingIncomeService
{
    public function calculateMatchingIncome($userId, $fromDate, $toDate)
    {
        $user = User::where('user_id', $userId)->first();
        if (!$user) {
            return [];
        }

        // Get left and right team members
        $leftTeam = $user->leftChild ? $this->getAllDescendants($user->leftChild) : collect();
        $rightTeam = $user->rightChild ? $this->getAllDescendants($user->rightChild) : collect();
        
        if ($user->leftChild) {
            $leftTeam->prepend($user->leftChild);
        }
        if ($user->rightChild) {
            $rightTeam->prepend($user->rightChild);
        }

        $leftUserIds = $leftTeam->pluck('user_id')->toArray();
        $rightUserIds = $rightTeam->pluck('user_id')->toArray();

        // Generate date range
        $dates = [];
        $currentDate = Carbon::parse($fromDate);
        $endDate = Carbon::parse($toDate);

        while ($currentDate <= $endDate) {
            $dates[] = $currentDate->format('Y-m-d');
            $currentDate->addDay();
        }

        $matchingData = [];
        $leftCarryForward = 0;
        $rightCarryForward = 0;

        foreach ($dates as $date) {
            // Get new BV for the date
            $newLeft = $this->getDailyBV($leftUserIds, $date);
            $newRight = $this->getDailyBV($rightUserIds, $date);

            // Calculate totals
            $totalLeft = $leftCarryForward + $newLeft;
            $totalRight = $rightCarryForward + $newRight;

            // Calculate matching
            $totalPair = min($totalLeft, $totalRight);
            $matchingBv = $totalPair;
            $flush = abs($totalLeft - $totalRight);

            // Calculate carry forward
            $leftCf = max(0, $totalLeft - $totalPair);
            $rightCf = max(0, $totalRight - $totalPair);

            $matchingData[] = [
                'closing_date' => $date,
                'new_left' => $newLeft,
                'new_right' => $newRight,
                'left_bf' => $leftCarryForward,
                'right_bf' => $rightCarryForward,
                'total_left' => $totalLeft,
                'total_right' => $totalRight,
                'total_pair' => $totalPair,
                'matching_bv' => $matchingBv,
                'flush' => $flush,
                'left_cf' => $leftCf,
                'right_cf' => $rightCf
            ];

            // Update carry forward for next iteration
            $leftCarryForward = $leftCf;
            $rightCarryForward = $rightCf;
        }

        return $matchingData;
    }

    private function getDailyBV($userIds, $date)
    {
        if (empty($userIds)) {
            return 0;
        }

        return BvHistory::whereIn('user_id', $userIds)
            ->where('type', 'credit')
            ->whereDate('created_at', $date)
            ->sum('bv_change');
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

    // Mock service for testing - returns sample data
    public function getMockMatchingData($userId, $fromDate, $toDate)
    {
        $dates = [];
        $currentDate = Carbon::parse($fromDate);
        $endDate = Carbon::parse($toDate);

        while ($currentDate <= $endDate && count($dates) < 30) { // Limit for demo
            $dates[] = $currentDate->format('Y-m-d');
            $currentDate->addDay();
        }

        $matchingData = [];
        $leftCarryForward = 0;
        $rightCarryForward = 0;

        foreach ($dates as $index => $date) {
            // Mock data generation
            $newLeft = rand(500, 2000);
            $newRight = rand(400, 1800);

            $totalLeft = $leftCarryForward + $newLeft;
            $totalRight = $rightCarryForward + $newRight;

            $totalPair = min($totalLeft, $totalRight);
            $matchingBv = $totalPair;
            $flush = abs($totalLeft - $totalRight);

            $leftCf = max(0, $totalLeft - $totalPair);
            $rightCf = max(0, $totalRight - $totalPair);

            $matchingData[] = [
                'closing_date' => $date,
                'new_left' => $newLeft,
                'new_right' => $newRight,
                'left_bf' => $leftCarryForward,
                'right_bf' => $rightCarryForward,
                'total_left' => $totalLeft,
                'total_right' => $totalRight,
                'total_pair' => $totalPair,
                'matching_bv' => $matchingBv,
                'flush' => $flush,
                'left_cf' => $leftCf,
                'right_cf' => $rightCf
            ];

            $leftCarryForward = $leftCf;
            $rightCarryForward = $rightCf;
        }

        return $matchingData;
    }
}