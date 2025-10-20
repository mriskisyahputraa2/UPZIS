<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    use HasFactory;

    protected $table = 'permohonans'; // Nama tabel jamak

    protected $fillable = ['mustahik_id', 'periode_id', 'unique_code', 'status', 'kategori_pemohon', 'notes_admin', 'photo'];

    // relasi ke tabel permohonan_dokumens
    public function dokumen()
    {
        // Setiap permohonan memiliki satu set dokumen.
        return $this->hasOne(PermohonanDokumen::class);
    }
    public function mustahik()
    {
        return $this->belongsTo(Mustahik::class);
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }

    public function penyalurans()
    {
        return $this->hasMany(Penyaluran::class);
    }
}
