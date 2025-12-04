<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BvHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'previous_bv',
        'bv_change',
        'new_bv',
        'type',
        'reason',
        'reference_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function referenceUser()
    {
        return $this->belongsTo(User::class, 'reference_id', 'user_id');
    }
}