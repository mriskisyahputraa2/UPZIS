<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function permohonans()
    {
        return $this->hasMany(Permohonan::class);
    }

    public function latestPermohonan()
    {
        return $this->hasOne(Permohonan::class)->latestOfMany();
    }
}
