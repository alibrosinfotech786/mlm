<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time',
        'topic',
        'trainer',
        'venue',
        'duration',
        'description',
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
        return $this->belongsToMany(User::class, 'training_participants')->withTimestamps();
    }
}