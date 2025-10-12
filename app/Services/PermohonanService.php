<?php

namespace App\Services;

use App\Models\Mustahik;
use App\Models\Permohonan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PermohonanService
{
    /**
     * Logika bisnis untuk memperbarui status permohonan.
     * Termasuk membuat data Mustahik baru jika statusnya 'Disetujui'.
     */
    public function updateStatus(Permohonan $permohonan, array $data): void
    {
        DB::transaction(function () use ($permohonan, $data) {
            $permohonan->update($data);

            // LOGIKA BISNIS KRUSIAL: Jika status diubah menjadi 'Disetujui'
            if ($data['status'] === 'Disetujui' && !$permohonan->mustahik_id) {
                // Buat data Mustahik baru dari data Permohonan
                $mustahik = Mustahik::create([
                    'name' => $permohonan->name,
                    'nik' => $permohonan->nik,
                    'kk_number' => $permohonan->kk_number,
                    'phone_number' => $permohonan->phone_number,
                    'address' => $permohonan->address,
                    'photo' => $permohonan->photo,
                ]);

                // Hubungkan permohonan ini dengan data mustahik yang baru dibuat
                $permohonan->mustahik_id = $mustahik->id;
                $permohonan->save();
            }
        });
    }

    /**
     * Logika bisnis untuk menghapus permohonan beserta semua filenya.
     */
    public function deletePermohonan(Permohonan $permohonan): void
    {
        $filesToDelete = [
            $permohonan->photo,
            $permohonan->file_ktp,
            $permohonan->file_kk,
            $permohonan->file_khs,
            $permohonan->file_surat_fakir_miskin,
            $permohonan->file_tidak_menerima_beasiswa,
            $permohonan->file_surat_permohonan,
        ];

        foreach ($filesToDelete as $file) {
            if ($file) {
                Storage::disk('public')->delete($file);
            }
        }

        $permohonan->delete();
    }
}
