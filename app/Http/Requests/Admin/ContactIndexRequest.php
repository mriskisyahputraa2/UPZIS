<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ContactIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Validasi Kontak
        return [
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Baru,Sudah Dibaca',
            'per_page' => 'nullable|integer|in:5,10,20,50',
        ];
    }
}
