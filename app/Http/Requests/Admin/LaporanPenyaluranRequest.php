<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class LaporanPenyaluranRequest
 *
 * Menangani validasi untuk semua permintaan yang terkait dengan laporan penyaluran.
 *
 * @package App\Http\Requests\Admin
 */
class LaporanPenyaluranRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Asumsikan hanya admin yang bisa mengakses, middleware sudah menangani ini.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:100',
            'periode_id' => 'nullable|integer|exists:periodes,id',
            'kategori_alokasi' => 'nullable|string|in:kampus,fakir_miskin,infaq,sedekah',
            'kategori_pemohon' => 'nullable|string|in:mahasiswa,umum',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'per_page' => 'nullable|integer|in:10,25,50,100',
        ];
    }
}
