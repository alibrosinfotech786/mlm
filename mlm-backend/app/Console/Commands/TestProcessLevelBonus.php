<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;

class TestProcessLevelBonus extends Command
{
    protected $signature = 'test:process-level-bonus {user_id}';
    protected $description = 'Test the processLevelBonus method for a specific user';

    public function handle()
    {
        $userId = $this->argument('user_id');
        
        $request = new Request(['user_id' => $userId]);
        $controller = new UserController();
        
        $response = $controller->processLevelBonus($request);
        $data = $response->getData(true);
        
        if ($data['success']) {
            $this->info("Level bonus processing completed for user: {$userId}");
            $this->info("Total bonus credited: {$data['total_bonus_credited']}");
            $this->info("Report ID: {$data['report_id']}");
            
            foreach ($data['level_bonuses_processed'] as $level) {
                $this->line("Level {$level['level']}: {$level['bonus']} BV (Users: {$level['users_count']}/{$level['expected_count']})");
            }
        } else {
            $this->error("Failed to process level bonus: {$data['message']}");
        }
    }
}