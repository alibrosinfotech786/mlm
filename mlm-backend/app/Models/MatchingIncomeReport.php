<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchingIncomeReport extends Model
{
    protected $fillable = [
        'user_id',
        'total_bonus_credited',
        'matching_data',
        'previous_bv',
        'new_bv',
        'status',
        'processing_type'
    ];

    protected $casts = [
        'matching_data' => 'array',
        'total_bonus_credited' => 'decimal:2',
        'previous_bv' => 'decimal:2',
        'new_bv' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
