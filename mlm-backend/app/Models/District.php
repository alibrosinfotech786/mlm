<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = [
        'name',
        'code',
        'state_id',
        'status'
    ];

    protected $casts = [
        'status' => 'boolean'
    ];

    public function state()
    {
        return $this->belongsTo(State::class);
    }
}
