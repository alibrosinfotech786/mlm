<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time',
        'venue',
        'address',
        'city',
        'state',
        'leader',
        'image1',
        'image2',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'time' => 'datetime:H:i',
        ];
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'event_participants')->withTimestamps();
    }
}