<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'sponsor_id',
        'sponsor_name',
        'root_id',
        'position',
        'nominee',
        'password',
        'transaction_password',
        'profile_picture',
        'bv',
        'wallet_balance',
        'rank',
        'role',
        'isActive',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'transaction_password' => 'hashed',
        ];
    }
    
    public function sponsor()
    {
        return $this->belongsTo(User::class, 'sponsor_id', 'user_id');
    }
    
    public function root()
    {
        return $this->belongsTo(User::class, 'root_id', 'user_id');
    }
    
    public function downlines()
    {
        return $this->hasMany(User::class, 'root_id', 'user_id');
    }
    
    public function leftChild()
    {
        return $this->hasOne(User::class, 'root_id', 'user_id')->where('position', 'left');
    }
    
    public function rightChild()
    {
        return $this->hasOne(User::class, 'root_id', 'user_id')->where('position', 'right');
    }
    
    public function kycDetail()
    {
        return $this->hasOne(KycDetail::class);
    }
    

    
    public function bvHistories()
    {
        return $this->hasMany(BvHistory::class, 'user_id', 'user_id');
    }
    
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id', 'user_id');
    }
    
    public function updateStatusBasedOnBv()
    {
        $isActive = $this->bv >= 1000;
        $this->update(['isActive' => $isActive]);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($user) {
            $user->user_id = self::generateUserId();
        });
    }

    private static function generateUserId()
    {
        $year = date('Y');
        $month = date('m');
        $prefix = "THT{$year}{$month}";
        
        $lastUser = self::where('user_id', 'like', $prefix . '%')
            ->orderBy('user_id', 'desc')
            ->first();
        
        if ($lastUser) {
            $lastNumber = (int) substr($lastUser->user_id, -10);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }
        
        return $prefix . str_pad($nextNumber, 10, '0', STR_PAD_LEFT);
    }
}
