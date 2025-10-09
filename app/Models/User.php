<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    public const ROLE_SUPERADMIN = 'superadmin';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_MUZAKKI = 'muzakki';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['name', 'email', 'password', 'phone_number', 'role', 'photo'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = ['password', 'remember_token'];

    // PERUBAHAN 2: Tambahkan $appends untuk menyertakan photo_url secara otomatis
    protected $appends = ['photo_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // PERUBAHAN 3: Tambahkan Accessor untuk mendapatkan URL foto
    public function getPhotoUrlAttribute()
    {
        if ($this->photo) {
            // Jika user punya foto, kembalikan URL dari storage
            return Storage::url($this->photo);
        }

        // Jika tidak punya, kembalikan null agar frontend bisa fallback
        return null;
    }

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function penyalurans()
    {
        return $this->hasMany(Penyaluran::class, 'admin_id');
    }
}
