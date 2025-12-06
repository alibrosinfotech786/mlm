<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\User;
use App\Http\Controllers\UserController;

class Kernel extends ConsoleKernel
{
    protected $commands = [];

    protected function schedule(Schedule $schedule)
    {
        // Process sponsor royalty bonus for all active users at month end
        $schedule->call(function () {
            $controller = new UserController();
            $users = User::where('isActive', true)->get();
            foreach ($users as $user) {
                try {
                    $request = new \Illuminate\Http\Request(['user_id' => $user->user_id]);
                    $controller->processLevelBonus($request);
                } catch (\Exception $e) {
                    \Log::error("Sponsor royalty failed for {$user->user_id}: " . $e->getMessage());
                }
            }
        })->monthlyOn(31, '23:50')->description('Process sponsor royalty bonus for all users');

        // Process team performance bonus for all active users at month end
        $schedule->call(function () {
            $controller = new UserController();
            $users = User::where('isActive', true)->get();
            foreach ($users as $user) {
                try {
                    $request = new \Illuminate\Http\Request(['user_id' => $user->user_id]);
                    $controller->processTeamPerformanceBonus($request);
                } catch (\Exception $e) {
                    \Log::error("Team performance failed for {$user->user_id}: " . $e->getMessage());
                }
            }
        })->monthlyOn(31, '23:55')->description('Process team performance bonus for all users');
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}