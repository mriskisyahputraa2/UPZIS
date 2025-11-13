<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @summary Validasi untuk request pembaruan status transaksi.
 */
class UpdateTransaksiStatusRequest extends FormRequest
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
            'status' => [
                'required',
                Rule::in(['Menunggu Pembayaran', 'Menunggu Verifikasi', 'Berhasil', 'Gagal', 'Kadaluarsa']),
            ],
        ];
    }
}
