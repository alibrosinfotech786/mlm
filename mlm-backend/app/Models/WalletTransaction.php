<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'auto_transaction_id',
        'deposit_by',
        'deposit_to',
        'deposit_amount',
        'ref_transaction_id',
        'remark',
        'attachment',
        'status',
        'status_updated_by',
        'status_updated_at',
    ];

    protected $casts = [
        'status_updated_at' => 'datetime',
    ];
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($transaction) {
            if (!$transaction->auto_transaction_id) {
                $transaction->auto_transaction_id = self::generateTransactionId();
            }
        });
    }
    
    private static function generateTransactionId()
    {
        $prefix = 'TXN' . date('Ymd');
        
        $lastTransaction = self::where('auto_transaction_id', 'like', $prefix . '%')
            ->orderBy('auto_transaction_id', 'desc')
            ->first();
        
        if ($lastTransaction) {
            $lastNumber = (int) substr($lastTransaction->auto_transaction_id, -6);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }
        
        return $prefix . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}