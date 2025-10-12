<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penyaluran;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PenyaluranController extends Controller
{
    /**
     * Menyimpan data penyaluran baru untuk sebuah permohonan.
     */
    public function store(Request $request, Permohonan $permohonan)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'distribution_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        Penyaluran::create([
            'permohonan_id' => $permohonan->id,
            'admin_id' => Auth::id(),
            'amount' => $validated['amount'],
            'distribution_date' => $validated['distribution_date'],
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Data penyaluran berhasil dicatat.');
    }

    /**
     * Memperbarui data catatan penyaluran.
     */
    public function update(Request $request, Penyaluran $penyaluran)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'distribution_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $penyaluran->update($validated);

        return back()->with('success', 'Catatan penyaluran berhasil diperbarui.');
    }

    /**
     * Menghapus data catatan penyaluran.
     */
    public function destroy(Penyaluran $penyaluran)
    {
        $penyaluran->delete();

        return back()->with('success', 'Catatan penyaluran berhasil dihapus.');
    }
}
