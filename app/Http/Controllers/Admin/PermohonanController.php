<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PermohonanController extends Controller
{
    /**
     * Menampilkan halaman daftar permohonan.
     */
    public function index(Request $request)
    {
         $request->validate([
            'periode_id' => 'nullable|integer|exists:periodes,id',
            'status' => 'nullable|string|in:Baru,Diverifikasi,Disetujui,Ditolak',
        ]);

       // Cari periode yang sedang aktif
        $activePeriode = Periode::where('status', 'Aktif')->first();

        $permohonans = Permohonan::query()
            ->with(['mustahik', 'periode'])
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('mustahik', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            // 3. Logika Filter Periode yang Diperbarui
            ->when($request->filled('periode_id'), function ($query) use ($request) {
                // Jika user memilih periode spesifik dari filter, gunakan itu.
                $query->where('periode_id', $request->input('periode_id'));
            })
            ->when(!$request->has('periode_id') && $activePeriode, function ($query) use ($activePeriode) {
                // Jika halaman baru dimuat (tidak ada filter periode di URL),
                // maka secara default filter berdasarkan periode yang aktif.
                $query->where('periode_id', $activePeriode->id);
            })
            ->latest()
            ->paginate($request->input('per_page', 5))
            ->withQueryString();

        $periodes = Periode::latest()->get(['id', 'name']);

        // 4. Pastikan filter yang dikirim ke frontend sesuai dengan yang diterapkan
        $currentFilters = $request->only(['search', 'per_page', 'status', 'periode_id']);
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

    /**
     * Menampilkan halaman detail permohonan.
     */
    public function show(Permohonan $permohonan)
    {
        // Load relasi mustahik dan periode agar bisa ditampilkan di view
        $permohonan->load(['mustahik', 'periode', "penyalurans.admin"]);

        return Inertia::render('admin/permohonan/show', [
            'permohonan' => $permohonan,
        ]);
    }

    /**
     * Memperbarui status permohonan.
     */
    public function update(Request $request, Permohonan $permohonan)
    {
        $request->validate([
            'status' => 'required|in:Baru,Diverifikasi,Disetujui,Ditolak',
            'notes_admin' => 'nullable|string',
        ]);

        $permohonan->update([
            'status' => $request->status,
            'notes_admin' => $request->notes_admin,
        ]);

        // Di sini nanti Anda bisa menambahkan logika untuk trigger notifikasi
        // event(new PermohonanStatusUpdated($permohonan));

        return redirect()->route('admin.permohonan.index')->with('success', 'Status permohonan berhasil diperbarui.');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:permohonans,id',
            'status' => 'required|in:Baru,Diverifikasi,Disetujui,Ditolak',
        ]);

        Permohonan::whereIn('id', $request->ids)->update(['status' => $request->status]);

        return back()->with('success', count($request->ids) . ' status permohonan berhasil diperbarui.');
    }

    /**
     * Menghapus data permohonan dari database.
     */
    public function destroy(Permohonan $permohonan)
    {
        // PERBAIKAN: Tambahkan semua file yang mungkin ada untuk dihapus
        $filesToDelete = [
            $permohonan->photo,
            $permohonan->file_ktp,
            $permohonan->file_kk,
            $permohonan->file_khs,
            $permohonan->file_surat_fakir_miskin,
            $permohonan->file_tidak_menerima_beasiswa,
            $permohonan->file_surat_permohonan,
        ];

        foreach ($filesToDelete as $file) {
            if ($file) {
                Storage::disk('public')->delete($file);
            }
        }

        $permohonan->delete();

        return redirect()->route('admin.permohonan.index')->with('success', 'Data permohonan berhasil dihapus.');
    }
}
