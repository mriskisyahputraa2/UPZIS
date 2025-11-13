<?php

namespace App\Repositories\Admin;

use App\Http\Requests\Admin\IndexTransaksiRequest;
use App\Models\Periode;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @summary Repositori untuk mengelola data Transaksi dari sisi Admin.
 *
 * @description
 * Kelas ini bertanggung jawab untuk semua interaksi dengan database
 * yang terkait dengan model Transaksi. Ini mengisolasi logika query
 * dari controller dan service.
 */
class TransaksiAdminRepository
{
    /**
     * @summary Membuat query dasar untuk transaksi dengan filter.
     *
     * @param IndexTransaksiRequest $request Data request yang berisi filter.
     * @return Builder
     */
    public function getFilteredTransactionsQuery(IndexTransaksiRequest $request): Builder
    {
        $query = Transaksi::with('user')->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $startDate = Carbon::parse($periode->start_date)->startOfDay();
                $endDate = Carbon::parse($periode->end_date)->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
        }

        return $query;
    }

    /**
     * @summary Mengambil semua periode untuk filter.
     *
     * @return Collection
     */
    public function getAllPeriodes(): Collection
    {
        return Periode::select('id', 'name')->get();
    }
}
