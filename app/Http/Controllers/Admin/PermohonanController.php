<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePermohonanRequest;
use App\Models\Periode;
use App\Models\Permohonan;
use App\Models\Setting;
use App\Models\Transaksi;
use App\Models\Penyaluran;
use App\Repositories\Admin\PermohonanRepository as AdminPermohonanRepository;
use App\Services\Admin\PermohonanService as AdminPermohonanService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermohonanController extends Controller
{
    public function __construct(protected AdminPermohonanRepository $permohonanRepository, protected AdminPermohonanService $permohonanService) {}

    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'per_page' => 'nullable|integer',
            'status' => 'nullable|string|in:Baru,Diverifikasi,Disetujui,Ditolak',
            'periode_id' => 'nullable|integer|exists:periodes,id',
            'jenis_kelamin' => 'nullable|string|in:Laki-laki,Perempuan',
            'kategori_pemohon' => 'nullable|string|in:mahasiswa,umum',
        ]);

        $permohonans = $this->permohonanRepository->getFilteredPermohonans($request);
        $periodes = Periode::latest()->get(['id', 'name']);
        $activePeriode = Periode::where('status', 'Aktif')->first();

        $currentFilters = $request->only(['search', 'per_page', 'status', 'periode_id', 'jenis_kelamin', 'kategori_pemohon']);
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
        // 1. Ambil persentase alokasi
        $alokasiPersen = (float) Setting::where('setting_key', 'alokasi_fakir_miskin_persen')->value('setting_value') ?: 10;
        $persenFakirMiskin = $alokasiPersen / 100;
        $persenKampus = 1 - $persenFakirMiskin;

        // 2. Hitung total dana masuk (Zakat, Infaq, Sedekah)
        $totalDanaZakat = Transaksi::where('status', 'Berhasil')->where('type', 'zakat')->sum('final_amount');
        $totalInfaqTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'infaq')->sum('final_amount');
        $totalSedekahTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'sedekah')->sum('final_amount');

        // 3. Hitung total dana keluar (per kategori)
        $penyaluranFakirMiskin = Penyaluran::where('kategori_alokasi', 'fakir_miskin')->sum('amount');
        $penyaluranKampus = Penyaluran::where('kategori_alokasi', 'kampus')->sum('amount');
        $penyaluranInfaq = Penyaluran::where('kategori_alokasi', 'infaq')->sum('amount');
        $penyaluranSedekah = Penyaluran::where('kategori_alokasi', 'sedekah')->sum('amount');

        // 4. Hitung sisa saldo untuk setiap "dompet"
        $availableFunds = [
            'sisaDanaKampus' => ($totalDanaZakat * $persenKampus) - $penyaluranKampus,
            'sisaDanaFakirMiskin' => ($totalDanaZakat * $persenFakirMiskin) - $penyaluranFakirMiskin,
            'sisaDanaInfaq' => $totalInfaqTerkumpul - $penyaluranInfaq,
            'sisaDanaSedekah' => $totalSedekahTerkumpul - $penyaluranSedekah,
        ];

        // 5. Muat relasi permohonan
        $permohonan->load(['mustahik', 'periode', 'penyalurans.admin', 'dokumen']);

        // 6. Kirim data permohonan DAN sisa saldo ke frontend
        return Inertia::render('admin/permohonan/show', [
            'permohonan' => $permohonan,
            'availableFunds' => $availableFunds,
        ]);
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
