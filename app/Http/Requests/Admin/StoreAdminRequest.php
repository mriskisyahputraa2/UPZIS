<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreAdminRequest
 *
 * Form request untuk validasi saat membuat admin baru.
 * @docs https://laravel.com/docs/11.x/validation#form-request-validation
 */
class StoreAdminRequest extends FormRequest
{
    /**
     * Menentukan apakah pengguna diizinkan untuk membuat request ini.
     */
    public function authorize(): bool
    {
        // Asumsikan hanya pengguna yang terotentikasi yang bisa membuat admin baru.
        // Anda bisa menambahkan Gate atau Policy di sini untuk keamanan lebih.
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
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }
}
