<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KycDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'dob',
        'pan_number',
        'aadhar_number',
        'account_holder_name',
        'bank_name',
        'account_number',
        'ifsc_code',
        'branch_name',
        'aadhar_front_path',
        'aadhar_back_path',
        'pan_card_path',
        'cancelled_cheque_path',
        'status',
        'nominee_name',
        'relation',
        'confirm_disclaimer',
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date',
            'confirm_disclaimer' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}