<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penyaluran;
use Illuminate\Http\Request;

class PenyaluranController extends Controller
{
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
