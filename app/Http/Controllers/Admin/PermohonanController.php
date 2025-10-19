<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePermohonanRequest;
use App\Models\Periode;
use App\Models\Permohonan;
use App\Repositories\PermohonanRepository;
use App\Services\PermohonanService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermohonanController extends Controller
{
    public function __construct(protected PermohonanRepository $permohonanRepository, protected PermohonanService $permohonanService) {}

    public function index(Request $request)
    {
        $permohonans = $this->permohonanRepository->getFilteredPermohonans($request);
        $periodes = Periode::latest()->get(['id', 'name']);
        $activePeriode = Periode::where('status', 'Aktif')->first();

        $currentFilters = $request->only(['search', 'per_page', 'status', 'periode_id', 'jenis_kelamin']);
        if (!$request->has('periode_id') && $activePeriode) {
            $currentFilters['periode_id'] = $activePeriode->id;
        }

        return Inertia::render('admin/permohonan/index', [
            'permohonans' => $permohonans,
            'filters' => $currentFilters,
            'periodes' => $periodes,
            'activePeriode' => $activePeriode,
        ]);
    }

    public function show(Permohonan $permohonan)
    {
        $permohonan->load(['mustahik', 'periode', 'penyalurans.admin']);

        return Inertia::render('admin/permohonan/show', ['permohonan' => $permohonan]);
    }

    public function update(UpdatePermohonanRequest $request, Permohonan $permohonan)
    {
        $this->permohonanService->updateStatus($permohonan, $request->validated());
        return back()->with('success', 'Status permohonan berhasil diperbarui.');
    }

    public function destroy(Permohonan $permohonan)
    {
        $this->permohonanService->deletePermohonan($permohonan);
        return redirect()->route('admin.permohonan.index')->with('success', 'Data permohonan berhasil dihapus.');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permohonans,id',
            'status' => 'required|in:Baru,Diverifikasi,Disetujui,Ditolak',
        ]);

        // Permohonan::whereIn($validated['ids'])->update(['status' => $validated['status']]);
        Permohonan::whereIn('id', $validated['ids'])->update(['status' => $validated['status']]);

        return back()->with('success', count($validated['ids']) . ' status permohonan berhasil diperbarui.');
    }
}
