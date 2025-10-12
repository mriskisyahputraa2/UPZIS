<?php

namespace App\Repositories;

use App\Models\Periode;
use App\Models\Permohonan;
use Illuminate\Http\Request;

class PermohonanRepository
{
    public function getFilteredPermohonans(Request $request)
    {
        $activePeriode = Periode::where('status', 'Aktif')->first();

        $query = Permohonan::query()
            ->with(['mustahik', 'periode'])
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('mustahik', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->filled('periode_id'), function ($query) use ($request) {
                $query->where('periode_id', $request->input('periode_id'));
            })
            ->when(!$request->has('periode_id') && $activePeriode, function ($query) use ($activePeriode) {
                $query->where('periode_id', $activePeriode->id);
            });

        return $query->latest()->paginate($request->input('per_page', 5))->withQueryString();
    }
}
