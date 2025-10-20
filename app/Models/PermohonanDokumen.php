<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermohonanDokumen extends Model
{
   use HasFactory;

    protected $table = 'permohonan_dokumens';

    protected $fillable = [
        'permohonan_id',
        'file_ktp',
        'file_kk',
        'file_khs',
        'file_surat_fakir_miskin',
        'file_tidak_menerima_beasiswa',
        'file_surat_permohonan',
        'file_rumah_depan',
        'file_rumah_belakang',
        'file_rumah_kiri',
        'file_rumah_kanan',
    ];

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class);
    }
}
