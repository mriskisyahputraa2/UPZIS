<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Permohonan extends Model
{
    use HasFactory;

    protected $table = 'permohonans'; // Nama tabel jamak

    protected $fillable = ['mustahik_id', 'periode_id', 'unique_code', 'status', 'kategori_pemohon', 'notes_admin', 'photo'];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::deleting(function ($permohonan) {
            // Hapus dokumen dan file fisik terkait
            if ($permohonan->dokumen) {
                $dokumen = $permohonan->dokumen;
                $fileColumns = [
                    'file_ktp', 'file_kk', 'file_khs', 'file_surat_fakir_miskin',
                    'file_tidak_menerima_beasiswa', 'file_surat_permohonan',
                    'file_rumah_depan', 'file_rumah_belakang', 'file_rumah_kiri', 'file_rumah_kanan'
                ];

                foreach ($fileColumns as $column) {
                    if ($dokumen->$column) {
                        Storage::disk('public')->delete($dokumen->$column);
                    }
                }

                // Hapus direktori file permohonan jika sudah kosong
                $directory = "permohonan_files/{$permohonan->id}";
                if (count(Storage::disk('public')->files($directory)) === 0) {
                    Storage::disk('public')->deleteDirectory($directory);
                }
            }
        });
    }

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
