<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_bonus_reports', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->decimal('total_bonus_credited', 15, 2)->default(0);
            $table->json('level_bonuses_data');
            $table->decimal('previous_bv', 15, 2)->default(0);
            $table->decimal('new_bv', 15, 2)->default(0);
            $table->string('status')->default('completed');
            $table->timestamps();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_bonus_reports');
    }
};