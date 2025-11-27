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
        Schema::create('matching_income_reports', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->decimal('total_bonus_credited', 10, 2)->default(0);
            $table->json('matching_data')->nullable();
            $table->decimal('previous_bv', 10, 2)->default(0);
            $table->decimal('new_bv', 10, 2)->default(0);
            $table->string('status')->default('pending');
            $table->string('processing_type')->default('production');
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matching_income_reports');
    }
};
