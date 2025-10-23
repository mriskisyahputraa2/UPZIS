<?php

namespace App\Repositories\Admin;

use App\Models\Contact;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class AdminContactRepository
{
    /**
     * Mengambil data pesan masuk yang sudah difilter dan dipaginasi.
     *
     * @param Request $request
     * @return LengthAwarePaginator
     */
    public function getPaginatedContacts(Request $request): LengthAwarePaginator
    {
        // Memindahkan semua logika query dari controller ke sini.
        return Contact::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', 'like', "%{$status}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 5))
            ->withQueryString();
    }
}
