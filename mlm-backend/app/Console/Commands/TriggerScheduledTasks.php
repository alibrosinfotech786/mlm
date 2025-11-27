<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TriggerScheduledTasks extends Command
{
    protected $signature = 'schedule:trigger';
    protected $description = 'Manually trigger the scheduled monthly bonus tasks';

    public function handle()
    {
        $this->info('Triggering scheduled monthly bonus tasks...');
        
        // Run level bonus processing
        $this->info('Running level bonus processing...');
        $this->call('mlm:process-monthly-level-bonus');
        
        // Run matching income processing
        $this->info('Running matching income processing...');
        $this->call('matching:process-monthly');
        
        $this->info('All scheduled tasks completed!');
        
        // Show report counts
        $levelReports = \App\Models\LevelBonusReport::count();
        $matchingReports = \App\Models\MatchingIncomeReport::count();
        
        $this->info("Total Level Bonus Reports: {$levelReports}");
        $this->info("Total Matching Income Reports: {$matchingReports}");
    }
}