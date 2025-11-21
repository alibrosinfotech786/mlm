<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'image',
        'mrp',
        'bv',
        'stock',
        'description',
        'ingredients',
        'benefits',
    ];

    protected $casts = [
        'stock' => 'boolean',
        'mrp' => 'decimal:2',
        'bv' => 'decimal:2',
    ];
}