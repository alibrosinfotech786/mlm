<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bv_histories', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->decimal('previous_bv', 10, 2);
            $table->decimal('bv_change', 10, 2);
            $table->decimal('new_bv', 10, 2);
            $table->string('type'); // 'credit' or 'debit'
            $table->string('reason'); // 'order_delivered', 'referral_bonus', 'order_cancelled', etc.
            $table->string('reference_id')->nullable(); // order_id or other reference
            $table->timestamps();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bv_histories');
    }
};