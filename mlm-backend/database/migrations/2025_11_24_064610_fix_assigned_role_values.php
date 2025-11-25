<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update users with role 'assigned' to 'user' (default role)
        DB::table('users')
            ->where('role', 'assigned')
            ->update(['role' => 'user']);
    }

    public function down(): void
    {
        // Revert back to 'assigned' if needed
        DB::table('users')
            ->where('role', 'user')
            ->update(['role' => 'assigned']);
    }
};