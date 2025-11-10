<?php

namespace App\Http\Requests\User;

use App\Models\Mustahik;
use App\Models\Permohonan;
use App\Models\Periode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Class StorePermohonanBantuanRequest
 * @package App\Http\Requests\User
 * @description Form Request untuk validasi data permohonan bantuan baru.
 * Kelas ini menangani semua aturan validasi, pesan error kustom,
 * dan validasi bisnis yang lebih kompleks.
 */
class StorePermohonanBantuanRequest extends FormRequest
{
    /**
     * Menentukan apakah user diizinkan untuk membuat request ini.
     * Karena ini adalah form publik, kita mengizinkannya.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Mendapatkan aturan validasi yang berlaku untuk request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'nik' => 'required|string|size:16',
            'kk_number' => 'required|string|size:16',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'file_ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_kk' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_khs' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_surat_fakir_miskin' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_tidak_menerima_beasiswa' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'file_surat_permohonan' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];
    }

    /**
     * Mendapatkan pesan validasi kustom.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo.required' => 'Foto profil wajib diunggah.',
            'photo.image' => 'File yang diunggah harus berupa gambar.',
            'photo.mimes' => 'Format foto harus jpg, jpeg, atau png.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'name.required' => 'Kolom Nama Lengkap wajib diisi.',
            'nik.required' => 'Kolom NIK wajib diisi.',
            'kk_number.required' => 'Kolom No. KK wajib diisi.',
            'phone_number.required' => 'Kolom No. Telepon wajib diisi.',
            'address.required' => 'Kolom Alamat wajib diisi.',
            'file_ktp.required' => 'Kolom KTP wajib diisi.',
            'file_kk.required' => 'Kolom KK wajib diisi.',
            'file_khs.required' => 'Kolom KHS wajib diisi.',
            'file_ktp.mimes' => 'Format file harus jpg, jpeg, png dan pdf.',
            'file_kk.mimes' => 'Format file harus jpg, jpeg, png dan pdf.',
            'file_khs.mimes' => 'Format file harus jpg, jpeg, png dan pdf.',
            'phone_number.max' => 'Kolom No. Telepon maksimal 20 karakter.',
            'kk_number.size' => 'Kolom No. KK harus 16 karakter.',
            'nik.size' => 'Kolom NIK harus 16 karakter.',
            'file_surat_fakir_miskin.required' => 'Surat Keterangan Fakir/Miskin wajib diunggah.',
            'file_tidak_menerima_beasiswa.required' => 'Surat Keterangan Tidak Menerima Beasiswa wajib diunggah.',
            'file_surat_permohonan.required' => 'Surat Permohonan wajib diunggah.',
        ];
    }

    /**
     * Mengkonfigurasi instance validator dengan validasi tambahan (after hook).
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $activePeriode = Periode::where('status', 'Aktif')->first();

            if (!$activePeriode) {
                // Menambahkan error global jika tidak ada periode aktif
                $validator->errors()->add('form', 'Saat ini tidak ada periode pendaftaran yang dibuka.');
                return;
            }

            $nik = $this->input('nik');
            $kk_number = $this->input('kk_number');

            $mustahikByNik = Mustahik::where('nik', $nik)->first();
            $mustahikByKk = Mustahik::where('kk_number', $kk_number)->first();

            // Cek #1: Apakah NIK sudah mendaftar di periode ini?
            if ($mustahikByNik) {
                $existingPermohonan = Permohonan::where('mustahik_id', $mustahikByNik->id)
                    ->where('periode_id', $activePeriode->id)
                    ->exists();
                if ($existingPermohonan) {
                    $validator->errors()->add('nik', 'NIK Anda sudah terdaftar pada periode bantuan ini.');
                }
            }

            // Cek #2: Apakah No. KK sudah digunakan oleh NIK yang berbeda?
            if ($mustahikByKk && (!$mustahikByNik || $mustahikByNik->id !== $mustahikByKk->id)) {
                $validator->errors()->add('kk_number', 'No. KK ini sudah terdaftar untuk NIK yang berbeda.');
            }
        });
    }
}
