<?php

namespace App\Repositories\User;

use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Permohonan;
use App\Models\PermohonanDokumen;

/**
 * Class PermohonanBantuanRepository
 * @package App\Repositories\User
 * @description Repositori untuk mengelola data terkait permohonan bantuan dari sisi publik.
 * Bertanggung jawab untuk semua interaksi dengan database (Eloquent Models).
 */
class PermohonanBantuanRepository
{
    /**
     * Mencari periode pendaftaran yang sedang aktif.
     *
     * @return Periode|null
     */
    public function findActivePeriode(): ?Periode
    {
        return Periode::where('status', 'Aktif')->first();
    }

    /**
     * Membuat atau memperbarui data mustahik berdasarkan NIK.
     * Jika NIK sudah ada, data akan diperbarui. Jika tidak, data baru akan dibuat.
     *
     * @param array $mustahikData Data untuk mustahik.
     * @return Mustahik
     */
    public function updateOrCreateMustahik(array $mustahikData): Mustahik
    {
        return Mustahik::updateOrCreate(
            ['nik' => $mustahikData['nik']],
            $mustahikData
        );
    }

    /**
     * Membuat data permohonan baru di database.
     *
     * @param array $permohonanData Data untuk permohonan.
     * @return Permohonan
     */
    public function createPermohonan(array $permohonanData): Permohonan
    {
        return Permohonan::create($permohonanData);
    }

    /**
     * Membuat data dokumen permohonan di database.
     *
     * @param array $dokumenData Data untuk dokumen permohonan.
     * @return PermohonanDokumen
     */
    public function createPermohonanDokumen(array $dokumenData): PermohonanDokumen
    {
        return PermohonanDokumen::create($dokumenData);
    }

    /**
     * Mencari permohonan berdasarkan kode uniknya.
     *
     * @param string $kode Kode unik permohonan.
     * @return Permohonan|null
     */
    public function findPermohonanByUniqueCode(string $kode): ?Permohonan
    {
        return Permohonan::where('unique_code', $kode)
            ->with(['mustahik', 'periode'])
            ->first();
    }

    /**
     * Mencari data mustahik berdasarkan NIK atau nomor telepon.
     *
     * @param string $identifier NIK atau nomor telepon.
     * @return Mustahik|null
     */
    public function findMustahikByIdentifier(string $identifier): ?Mustahik
    {
        return Mustahik::where('nik', $identifier)
            ->orWhere('phone_number', $identifier)
            ->first();
    }

    /**
     * Mencari permohonan terbaru yang pernah diajukan oleh seorang mustahik.
     *
     * @param int $mustahikId ID dari mustahik.
     * @return Permohonan|null
     */
    public function findLatestPermohonanByMustahikId(int $mustahikId): ?Permohonan
    {
        return Permohonan::where('mustahik_id', $mustahikId)
            ->with(['mustahik', 'periode'])
            ->latest()
            ->first();
    }
}
