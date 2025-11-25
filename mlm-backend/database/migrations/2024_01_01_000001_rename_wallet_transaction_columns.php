<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->renameColumn('transaction_id', 'ref_transaction_id');
            $table->renameColumn('approved_by', 'status_updated_by');
            $table->renameColumn('approved_at', 'status_updated_at');
        });
    }

    public function down()
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->renameColumn('ref_transaction_id', 'transaction_id');
            $table->renameColumn('status_updated_by', 'approved_by');
            $table->renameColumn('status_updated_at', 'approved_at');
        });
    }
};