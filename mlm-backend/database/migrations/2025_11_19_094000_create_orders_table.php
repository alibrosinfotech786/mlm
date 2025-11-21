<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->enum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->enum('payment_mode', ['cod', 'online', 'wallet']);
            
            // Billing Address
            $table->string('billing_full_name');
            $table->string('billing_email');
            $table->string('billing_contact');
            $table->string('billing_country');
            $table->string('billing_state');
            $table->string('billing_city');
            $table->string('billing_pincode');
            
            // Shipping Address
            $table->string('shipping_full_name');
            $table->string('shipping_email');
            $table->string('shipping_contact');
            $table->string('shipping_country');
            $table->string('shipping_state');
            $table->string('shipping_city');
            $table->string('shipping_pincode');
            
            $table->decimal('total_bv', 10, 2);
            $table->decimal('total_mrp', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};