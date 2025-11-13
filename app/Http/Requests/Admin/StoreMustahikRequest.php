<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMustahikRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isUmum = $this->input('kategori_pemohon') === 'umum';

        return [
            'name' => 'required|string|max:255',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'kategori_pemohon' => 'required|string|in:mahasiswa,umum',
            'nik' => 'required|string|size:16',
            'kk_number' => 'required|string|size:16',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'pekerjaan' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'max:255'],
            'jumlah_tanggungan' => [Rule::requiredIf($isUmum), 'nullable', 'integer', 'min:0'],
            'status_rumah' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'in:Milik Sendiri,Sewa/Kontrak,Menumpang'],
            'file_sktm' => [Rule::requiredIf($isUmum), 'nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'file_rumah_depan' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
            'file_rumah_belakang' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
            'file_rumah_kiri' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
            'file_rumah_kanan' => [Rule::requiredIf($isUmum), 'nullable', 'image', 'max:2048'],
        ];
    }

    /**
     * Get the custom validation messages for the defined rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama lengkap tidak boleh lebih dari 255 karakter.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'kategori_pemohon.required' => 'Kategori mustahik wajib dipilih.',
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'address.required' => 'Alamat lengkap wajib diisi.',
            'photo.required' => 'Foto mustahik wajib diunggah.',
            'photo.image' => 'File foto harus berupa gambar.',
            'photo.mimes' => 'Format foto harus jpeg, png, atau jpg.',
            'photo.max' => 'Ukuran file foto maksimal 2MB.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus 16 digit.',
            'kk_number.required' => 'Nomor KK wajib diisi.',
            'kk_number.size' => 'Nomor KK harus 16 digit.',
            'pekerjaan.required' => 'Pekerjaan wajib diisi untuk kategori Umum.',
            'jumlah_tanggungan.required' => 'Jumlah tanggungan wajib diisi untuk kategori Umum.',
            'status_rumah.required' => 'Status rumah wajib diisi untuk kategori Umum.',
            'file_sktm.required' => 'SKTM wajib diunggah untuk kategori Umum.',
            'file_sktm.mimes' => 'Format SKTM harus jpg, jpeg, png, atau pdf.',
            'file_sktm.max' => 'Ukuran file SKTM maksimal 2MB.',
            'file_rumah_depan.required' => 'Foto rumah depan wajib diunggah untuk kategori Umum.',
            'file_rumah_depan.image' => 'File harus berupa gambar.',
            'file_rumah_depan.max' => 'Ukuran file maksimal 2MB.',
        ];
    }
}
