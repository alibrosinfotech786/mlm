<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\ProcessMonthlyLevelBonus::class,
        Commands\ProcessMonthlyMatchingIncome::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        // Run level bonus processing on the last day of every month at 23:59
        $schedule->command('mlm:process-monthly-level-bonus')
                 ->monthly()
                 ->lastDayOfMonth('23:59')
                 ->description('Process monthly level bonuses for all users');
        
        // Run matching income processing on the last day of every month at 23:30
        $schedule->command('matching:process-monthly')
                 ->monthly()
                 ->lastDayOfMonth('23:30')
                 ->description('Process monthly matching income for all users');
        
        // For testing: Run daily when FORCE_MONTHLY_BONUS=true in .env
        if (env('FORCE_MONTHLY_BONUS', false)) {
            $schedule->command('mlm:process-monthly-level-bonus')
                     ->daily()
                     ->at('00:01')
                     ->description('Daily level bonus processing for testing');
            
            $schedule->command('matching:process-monthly --test')
                     ->daily()
                     ->at('00:02')
                     ->description('Daily matching income processing for testing');
        }
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}