<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BvTopupRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bv_amount',
        'payment_amount',
        'payment_method',
        'transaction_id',
        'payment_reference',
        'remark',
        'attachment',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason'
    ];

    protected $casts = [
        'approved_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by', 'user_id');
    }
}
