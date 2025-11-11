<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class UploadProofRequest
 *
 * Menangani validasi untuk permintaan unggah bukti pembayaran.
 *
 * @package App\Http\Requests\User
 */
class UploadProofRequest extends FormRequest
{
    /**
     * Menentukan apakah user yang diautentikasi dapat membuat permintaan ini.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Hanya user yang sudah login yang bisa mengunggah bukti.
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
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }
}
