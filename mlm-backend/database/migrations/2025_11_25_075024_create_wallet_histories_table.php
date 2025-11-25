<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallet_histories', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->decimal('previous_balance', 10, 2);
            $table->decimal('amount_change', 10, 2);
            $table->decimal('new_balance', 10, 2);
            $table->enum('type', ['credit', 'debit']);
            $table->string('reason');
            $table->string('reference_id')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_histories');
    }
};