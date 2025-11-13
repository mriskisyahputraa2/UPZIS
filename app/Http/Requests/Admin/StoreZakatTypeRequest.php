<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreZakatTypeRequest
 *
 * Form request untuk validasi saat membuat jenis zakat baru.
 * @docs https://laravel.com/docs/11.x/validation#form-request-validation
 */
class StoreZakatTypeRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:jenis_zakat,name',
            'description' => 'required|string',
            'rate_percent' => 'required|numeric|min:0|max:100',
            'nisab_basis' => 'required|string|in:emas,perak,beras,uang',
            'nisab_quantity' => 'required|numeric|min:0',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ];
    }
}
