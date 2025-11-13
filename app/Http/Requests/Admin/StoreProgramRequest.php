<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreProgramRequest
 *
 * @docs https://laravel.com/docs/11.x/validation#form-request-validation
 */
class StoreProgramRequest extends FormRequest
{
    /**
     * Menentukan apakah pengguna diizinkan untuk membuat request ini.
     */
    public function authorize(): bool
    {
        // Izinkan semua pengguna yang terotentikasi untuk membuat program.
        // Anda bisa menambahkan logika otorisasi yang lebih spesifik di sini jika perlu.
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
            'description' => 'nullable|string',
            'program_date' => 'required|date',
            'status' => 'required|string|in:Draft,Published',
            'photos' => 'nullable|array',
            'photos.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }
}
