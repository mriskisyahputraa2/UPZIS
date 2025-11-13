<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @summary Validasi untuk request filter pada halaman daftar transaksi dan ekspor.
 */
class IndexTransaksiRequest extends FormRequest
{
    /**
     * Menentukan apakah user berwenang untuk membuat request ini.
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
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string',
            'type' => 'nullable|string|in:zakat,infaq,sedekah',
            'per_page' => 'nullable|integer|in:5,10,20,50',
            'periode_id' => 'nullable|integer|exists:periodes,id',
        ];
    }
}
