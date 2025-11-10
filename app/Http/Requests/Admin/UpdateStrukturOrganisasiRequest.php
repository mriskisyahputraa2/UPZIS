<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStrukturOrganisasiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Izinkan jika pengguna sudah login (asumsi admin)
        // Anda bisa tambahkan logika role di sini jika perlu
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'keterangan' => 'nullable|string',
        ];
    }
}
