<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('matching_income', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->date('closing_date');
            $table->decimal('new_left', 10, 2)->default(0);
            $table->decimal('new_right', 10, 2)->default(0);
            $table->decimal('left_bf', 10, 2)->default(0); // Brought Forward
            $table->decimal('right_bf', 10, 2)->default(0);
            $table->decimal('total_left', 10, 2)->default(0);
            $table->decimal('total_right', 10, 2)->default(0);
            $table->decimal('total_pair', 10, 2)->default(0);
            $table->decimal('matching_bv', 10, 2)->default(0);
            $table->decimal('flush', 10, 2)->default(0);
            $table->decimal('left_cf', 10, 2)->default(0); // Carry Forward
            $table->decimal('right_cf', 10, 2)->default(0);
            $table->decimal('amount', 10, 2)->default(0);
            $table->decimal('payout_percentage', 5, 2)->default(10.00);
            $table->timestamps();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->unique(['user_id', 'closing_date']);
            $table->index(['user_id', 'closing_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('matching_income');
    }
};