<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('team_performance_bonuses', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->decimal('left_current_bv', 15, 2)->default(0);
            $table->decimal('right_current_bv', 15, 2)->default(0);
            $table->decimal('previous_left_carry_forward', 15, 2)->default(0);
            $table->decimal('previous_right_carry_forward', 15, 2)->default(0);
            $table->decimal('total_left_bv', 15, 2)->default(0);
            $table->decimal('total_right_bv', 15, 2)->default(0);
            $table->decimal('matching_bv', 15, 2)->default(0);
            $table->decimal('bonus_amount', 15, 2)->default(0);
            $table->decimal('new_left_carry_forward', 15, 2)->default(0);
            $table->decimal('new_right_carry_forward', 15, 2)->default(0);
            $table->integer('left_team_count')->default(0);
            $table->integer('right_team_count')->default(0);
            $table->decimal('previous_wallet_balance', 15, 2)->default(0);
            $table->decimal('new_wallet_balance', 15, 2)->default(0);
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->timestamps();
            
            $table->index('user_id');
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_performance_bonuses');
    }
};
