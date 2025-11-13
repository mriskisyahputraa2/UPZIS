<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateAdminRequest
 *
 * Form request untuk validasi saat memperbarui data admin.
 * @docs https://laravel.com/docs/11.x/validation#form-request-validation
 */
class UpdateAdminRequest extends FormRequest
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
        // Mengambil ID admin dari route parameter
        $adminId = $this->route('admin')->id;

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class.',email,'.$adminId,
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ];
    }
}
