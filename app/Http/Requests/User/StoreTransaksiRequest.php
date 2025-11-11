<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class StoreTransaksiRequest
 *
 * Menangani validasi untuk permintaan pembuatan transaksi baru oleh user (Muzakki).
 *
 * @package App\Http\Requests\User
 */
class StoreTransaksiRequest extends FormRequest
{
    /**
     * Menentukan apakah user yang diautentikasi dapat membuat permintaan ini.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Hanya user yang sudah login yang bisa membuat transaksi.
        return Auth::check();
    }

    /**
     * Mendapatkan aturan validasi yang berlaku untuk permintaan ini.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|string|in:zakat,infaq,sedekah',
            'amount' => 'required|numeric|min:10000|max:9999999999999.99',
            'payment_method' => 'required|string|in:DANA,GoPay,Tunai',
        ];
    }

    /**
     * Mendapatkan pesan error kustom untuk aturan validasi.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amount.max' => 'Nominal yang Anda masukkan terlalu besar.',
        ];
    }
}
