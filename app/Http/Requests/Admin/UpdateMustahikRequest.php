<?php

namespace App\Http\Requests\Admin;

use App\Models\Mustahik;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMustahikRequest extends FormRequest
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
        $mustahikId = $this->route('mustahik')->id;

        return [
            'name' => 'required|string|max:255',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'kategori_pemohon' => 'required|string|in:mahasiswa,umum',
            'nik' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahikId)],
            'kk_number' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahikId)],
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'pekerjaan' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'max:255'],
            'jumlah_tanggungan' => [Rule::requiredIf($isUmum), 'nullable', 'integer', 'min:0'],
            'status_rumah' => [Rule::requiredIf($isUmum), 'nullable', 'string', 'in:Milik Sendiri,Sewa/Kontrak,Menumpang'],
            'file_sktm' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'file_rumah_depan' => ['nullable', 'image', 'max:2048'],
            'file_rumah_belakang' => ['nullable', 'image', 'max:2048'],
            'file_rumah_kiri' => ['nullable', 'image', 'max:2048'],
            'file_rumah_kanan' => ['nullable', 'image', 'max:2048'],
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
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'kategori_pemohon.required' => 'Kategori mustahik wajib dipilih.',
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'address.required' => 'Alamat lengkap wajib diisi.',
            'photo.image' => 'File foto harus berupa gambar.',
            'photo.mimes' => 'Format foto harus jpeg, png, atau jpg.',
            'photo.max' => 'Ukuran file foto maksimal 2MB.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK ini sudah terdaftar di sistem.',
            'kk_number.required' => 'Nomor KK wajib diisi.',
            'kk_number.size' => 'Nomor KK harus 16 digit.',
            'kk_number.unique' => 'Nomor KK ini sudah terdaftar di sistem.',
            'pekerjaan.required' => 'Pekerjaan wajib diisi untuk kategori Umum.',
            'jumlah_tanggungan.required' => 'Jumlah tanggungan wajib diisi untuk kategori Umum.',
            'status_rumah.required' => 'Status rumah wajib diisi untuk kategori Umum.',
        ];
    }
}
