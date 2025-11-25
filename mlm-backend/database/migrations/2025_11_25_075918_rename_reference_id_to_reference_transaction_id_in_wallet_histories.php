<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wallet_histories', function (Blueprint $table) {
            $table->renameColumn('reference_id', 'reference_transaction_id');
        });
    }

    public function down(): void
    {
        Schema::table('wallet_histories', function (Blueprint $table) {
            $table->renameColumn('reference_transaction_id', 'reference_id');
        });
    }
};