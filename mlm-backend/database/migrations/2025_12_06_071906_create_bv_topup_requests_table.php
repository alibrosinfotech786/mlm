<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bv_topup_requests', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->decimal('bv_amount', 10, 2);
            $table->decimal('payment_amount', 10, 2);
            $table->string('payment_method')->nullable();
            $table->string('transaction_id')->unique();
            $table->string('payment_reference')->nullable();
            $table->text('remark')->nullable();
            $table->string('attachment')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bv_topup_requests');
    }
};
