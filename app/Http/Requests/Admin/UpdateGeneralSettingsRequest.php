<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateGeneralSettingsRequest
 *
 * Form request untuk validasi saat memperbarui pengaturan umum.
 * @docs https://laravel.com/docs/11.x/validation#form-request-validation
 */
class UpdateGeneralSettingsRequest extends FormRequest
{
    /**
     * Menentukan apakah pengguna diizinkan untuk membuat request ini.
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
            'harga_emas_per_gram' => 'required|numeric|min:0',
            'contact_address' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:255',
            'alokasi_fakir_miskin_persen' => 'required|numeric|min:0|max:100',
        ];
    }
}
