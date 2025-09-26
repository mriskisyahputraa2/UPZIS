<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PermohonanController extends Controller
{
    /**
     * Menampilkan halaman daftar permohonan.
     */
    public function index(Request $request)
    {
        // Membangun query secara dinamis
        $permohonans = Permohonan::query()
            ->with(['mustahik', 'periode']) // Eager load relasi
            ->when($request->input('search'), function ($query, $search) {
                // Mencari berdasarkan nama atau NIK mustahik (melalui relasi)
                $query->whereHas('mustahik', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 5)) // <-- Default 5 data per halaman
            ->withQueryString();

        return Inertia::render('admin/permohonan/index', [
            'permohonans' => $permohonans,
            'filters' => $request->only(['search', 'per_page']), // Kirim filter ke view
        ]);
    }

    /**
     * Menampilkan halaman detail permohonan.
     */
    public function show(Permohonan $permohonan)
    {
        // Load relasi mustahik dan periode agar bisa ditampilkan di view
        $permohonan->load(['mustahik', 'periode']);

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
        // Hapus file-file terkait dari storage untuk membersihkan server
        if ($permohonan->photo) {
            Storage::disk('public')->delete($permohonan->photo);
        }
        if ($permohonan->file_ktp) {
            Storage::disk('public')->delete($permohonan->file_ktp);
        }
        if ($permohonan->file_kk) {
            Storage::disk('public')->delete($permohonan->file_kk);
        }
        if ($permohonan->file_khs) {
            Storage::disk('public')->delete($permohonan->file_khs);
        }

        $permohonan->delete();

        return redirect()->route('admin.permohonan.index')->with('success', 'Data permohonan berhasil dihapus.');
    }
}
