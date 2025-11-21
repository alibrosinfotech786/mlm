<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',             /* pending, confirmed, shipped, delivered,  cancelled */
        'payment_mode',
        'billing_full_name',
        'billing_email',
        'billing_contact',
        'billing_country',
        'billing_state',
        'billing_city',
        'billing_pincode',
        'shipping_full_name',
        'shipping_email',
        'shipping_contact',
        'shipping_country',
        'shipping_state',
        'shipping_city',
        'shipping_pincode',
        'total_bv',
        'total_mrp',
    ];

    protected $casts = [
        'total_bv' => 'decimal:2',
        'total_mrp' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}