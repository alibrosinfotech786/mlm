<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamPerformanceBonus extends Model
{
    protected $table = 'team_performance_bonuses';
    
    protected $fillable = [
        'user_id',
        'left_current_bv',
        'right_current_bv',
        'previous_left_carry_forward',
        'previous_right_carry_forward',
        'left_total_bv',
        'right_total_bv',
        'matching_bv',
        'bonus_percentage',
        'bonus_amount',
        'new_left_carry_forward',
        'new_right_carry_forward',
        'left_team_count',
        'right_team_count',
        'previous_wallet_balance',
        'new_wallet_balance',
        'status',
        'processing_type',
        'processed_at'
    ];

    protected $casts = [
        'left_current_bv' => 'decimal:2',
        'right_current_bv' => 'decimal:2',
        'previous_left_carry_forward' => 'decimal:2',
        'previous_right_carry_forward' => 'decimal:2',
        'left_total_bv' => 'decimal:2',
        'right_total_bv' => 'decimal:2',
        'matching_bv' => 'decimal:2',
        'bonus_percentage' => 'decimal:2',
        'bonus_amount' => 'decimal:2',
        'new_left_carry_forward' => 'decimal:2',
        'new_right_carry_forward' => 'decimal:2',
        'previous_wallet_balance' => 'decimal:2',
        'new_wallet_balance' => 'decimal:2',
        'processed_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}