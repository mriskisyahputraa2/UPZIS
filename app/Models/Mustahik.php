<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Mustahik extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'jenis_kelamin',
        'nik',
        'kk_number',
        'address',
        'phone_number',
        'photo',
        'pekerjaan',
        'jumlah_tanggungan',
        'status_rumah',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::deleting(function ($mustahik) {
            // Hapus foto profil dari storage jika ada
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
            }

            // Hapus semua permohonan terkait (ini akan mentrigger event deleting di model Permohonan)
            $mustahik->permohonans()->each(function ($permohonan) {
                $permohonan->delete();
            });
        });
    }

    public function permohonans()
    {
        return $this->hasMany(Permohonan::class);
    }

    public function latestPermohonan()
    {
        return $this->hasOne(Permohonan::class)->latestOfMany();
    }
}
