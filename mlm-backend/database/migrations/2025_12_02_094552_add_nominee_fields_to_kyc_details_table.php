<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kyc_details', function (Blueprint $table) {
            $table->string('nominee_name')->nullable();
            $table->string('relation')->nullable();
            $table->boolean('confirm_disclaimer')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('kyc_details', function (Blueprint $table) {
            $table->dropColumn(['nominee_name', 'relation', 'confirm_disclaimer']);
        });
    }
};