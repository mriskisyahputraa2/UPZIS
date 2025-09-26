<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    use HasFactory;

    protected $table = 'permohonans'; // Nama tabel jamak

    protected $fillable = [
        'mustahik_id',
        'periode_id',
        'unique_code',
        'status',
        'file_ktp',
        'file_kk',
        'file_khs',
        'notes_admin',
        'photo',
    ];

    public function mustahik()
    {
        return $this->belongsTo(Mustahik::class);
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }

    public function penyaluran()
    {
        return $this->hasOne(Penyaluran::class);
    }
}
