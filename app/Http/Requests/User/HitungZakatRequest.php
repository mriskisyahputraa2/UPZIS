<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class HitungZakatRequest
 *
 * @package App\Http\Requests\User
 *
 * @property int $jenis_zakat_id
 * @property float $pendapatan_pokok
 * @property float|null $pendapatan_lain
 * @property float|null $hutang_cicilan
 */
class HitungZakatRequest extends FormRequest
{
    /**
     * Menentukan apakah pengguna diizinkan untuk membuat permintaan ini.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Diizinkan untuk semua pengunjung
        return true;
    }

    /**
     * Mendapatkan aturan validasi yang berlaku untuk permintaan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'jenis_zakat_id' => 'required|exists:jenis_zakat,id',
            'pendapatan_pokok' => 'required|numeric|min:0',
            'pendapatan_lain' => 'nullable|numeric|min:0',
            'hutang_cicilan' => 'nullable|numeric|min:0',
        ];
    }
}
