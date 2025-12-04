<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UpdateUserPackages extends Command
{
    protected $signature = 'users:update-packages';
    protected $description = 'Update all users packages and status based on their BV';

    public function handle()
    {
        $users = User::all();
        $updated = 0;

        foreach ($users as $user) {
            $user->updateStatusBasedOnBv();
            $updated++;
        }

        $this->info("Updated {$updated} users' packages and status based on BV.");
        return 0;
    }
}