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
        'course_fee',
        'syllabus',
        'level',
        'image',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'time' => 'datetime:H:i',
            'syllabus' => 'array',
        ];
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'training_participants')->withTimestamps();
    }
}