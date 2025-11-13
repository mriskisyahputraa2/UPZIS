<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateProgramRequest
 *
 * @docs https://laravel.com/docs/11.x/validation#form-request-validation
 */
class UpdateProgramRequest extends FormRequest
{
    /**
     * Menentukan apakah pengguna diizinkan untuk membuat request ini.
     */
    public function authorize(): bool
    {
        // Izinkan semua pengguna yang terotentikasi untuk memperbarui program.
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
            'photos.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'deleted_photos' => 'nullable|array',
            'deleted_photos.*' => 'integer|exists:program_photos,id',
            'penyaluran_ids' => 'nullable|array',
            'penyaluran_ids.*' => 'integer|exists:penyalurans,id',
        ];
    }
}
