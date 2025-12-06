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
        Schema::table('team_performance_bonuses', function (Blueprint $table) {
            $table->decimal('left_total_bv', 15, 2)->default(0)->after('previous_right_carry_forward');
            $table->decimal('right_total_bv', 15, 2)->default(0)->after('left_total_bv');
            $table->decimal('bonus_percentage', 5, 2)->default(0)->after('matching_bv');
            $table->string('processing_type')->default('manual')->after('status');
            $table->timestamp('processed_at')->nullable()->after('processing_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_performance_bonuses', function (Blueprint $table) {
            $table->dropColumn(['left_total_bv', 'right_total_bv', 'bonus_percentage', 'processing_type', 'processed_at']);
        });
    }
};
