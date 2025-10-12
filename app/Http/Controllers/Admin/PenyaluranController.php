<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePenyaluranRequest;
use App\Models\Penyaluran;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PenyaluranController extends Controller
{
    /**
     * Menyimpan data penyaluran baru untuk sebuah permohonan.
     */
    public function store(StorePenyaluranRequest $request, Permohonan $permohonan)
    {
        // Siapkan data tambahan
        $data = array_merge($request->validated(), [
            'permohonan_id' => $permohonan->id,
            'admin_id' => Auth::id(),
        ]);

        Penyaluran::create($data);

        return back()->with('success', 'Data penyaluran berhasil dicatat.');
    }
    /**
     * Memperbarui data catatan penyaluran.
     */
    public function update(StorePenyaluranRequest $request, Penyaluran $penyaluran)
    {
        $penyaluran->update($request->validated());

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
