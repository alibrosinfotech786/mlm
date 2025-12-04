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
        'state_id',
        'district_id',
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
        'package',
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
    
    public function state()
    {
        return $this->belongsTo(State::class);
    }
    
    public function district()
    {
        return $this->belongsTo(District::class);
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
        $package = $this->getPackageByBv($this->bv);
        $this->update(['isActive' => $isActive, 'package' => $package]);
    }

    public function getPackageByBv($bv)
    {
        if ($bv >= 10000) return 'legend';
        if ($bv >= 4000) return 'leader';
        if ($bv >= 2000) return 'performer';
        if ($bv >= 1000) return 'builder';
        if ($bv >= 500) return 'starter';
        return 'starter';
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($user) {
            // user_id will be set in the controller with state and district codes
        });
    }

    public static function generateUserId($stateCode, $districtCode)
    {
        $prefix = strtoupper($stateCode . str_pad($districtCode, 2, '0', STR_PAD_LEFT));
        
        // Get the highest number for this specific state-district combination
        $lastUser = self::where('user_id', 'LIKE', $prefix . '-%')
            ->orderBy('user_id', 'desc')
            ->first();
        
        if ($lastUser && $lastUser->user_id) {
            // Extract last 7 digits after the hyphen
            $parts = explode('-', $lastUser->user_id);
            $lastNumber = (int) end($parts);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }
        
        return $prefix . '-' . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
    }
}
