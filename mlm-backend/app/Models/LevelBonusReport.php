<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LevelBonusReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_bonus_credited',
        'level_bonuses_data',
        'previous_bv',
        'new_bv',
        'status'
    ];

    protected $casts = [
        'level_bonuses_data' => 'array',
        'total_bonus_credited' => 'decimal:2',
        'previous_bv' => 'decimal:2',
        'new_bv' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}