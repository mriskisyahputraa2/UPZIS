<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdatePaymentSettingsRequest
 *
 * Form request untuk validasi saat memperbarui pengaturan akun pembayaran.
 * @docs https://laravel.com/docs/11.x/validation#form-request-validation
 */
class UpdatePaymentSettingsRequest extends FormRequest
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
            'dana.account' => 'required|string|max:100',
            'dana.name' => 'required|string|max:100',
            'dana.steps' => 'required|array|min:1',
            'dana.steps.*' => 'required|string|max:255',

            'gopay.account' => 'required|string|max:100',
            'gopay.name' => 'required|string|max:100',
            'gopay.steps' => 'required|array|min:1',
            'gopay.steps.*' => 'required|string|max:255',

            'tunai.account' => 'required|string|max:100',
            'tunai.name' => 'required|string|max:100',
            'tunai.steps' => 'required|array|min:1',
            'tunai.steps.*' => 'required|string|max:255',
        ];
    }
}
