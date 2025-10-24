<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Periode;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PeriodeController extends Controller
{
    /**
     * Menampilkan halaman daftar periode.
     */
    public function index(Request $request)
    {
        $periodes = Periode::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 5))
            ->withQueryString();

        return Inertia::render('admin/periode/index', [
            'periodes' => $periodes,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Menampilkan form untuk membuat periode baru.
     */
    public function create()
    {
        return Inertia::render('admin/periode/create');
    }

    /**
     * Menyimpan periode baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:periodes',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        // Aturan Bisnis: Jika periode baru ini 'Aktif', nonaktifkan semua yang lain.
        if ($validated['status'] === 'Aktif') {
            Periode::where('status', 'Aktif')->update(['status' => 'Tidak Aktif']);
        }

        Periode::create($validated);

        return redirect()->route('admin.periode.index')->with('success', 'Periode baru berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit periode.
     */
    public function edit(Periode $periode)
    {
        // return Inertia::render('admin/periode/edit', [
        //     'periode' => $periode,
        // ]);
        return Inertia::render('admin/periode/edit', [
            'periode' => [
                'id' => $periode->id,
                'name' => $periode->name,
                'description' => $periode->description,
                'start_date' => $periode->start_date ? $periode->start_date->format('Y-m-d') : null,
                'end_date' => $periode->end_date ? $periode->end_date->format('Y-m-d') : null,
                'status' => $periode->status,
            ],
        ]);
    }

    /**
     * Memperbarui data periode di database.
     */
    public function update(Request $request, Periode $periode)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('periodes')->ignore($periode->id)],
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        // Aturan Bisnis: Jika periode ini diubah menjadi 'Aktif', nonaktifkan semua yang lain.
        if ($validated['status'] === 'Aktif') {
            Periode::where('id', '!=', $periode->id)
                ->where('status', 'Aktif')
                ->update(['status' => 'Tidak Aktif']);
        }

        $periode->update($validated);

        return redirect()->route('admin.periode.index')->with('success', 'Data periode berhasil diperbarui.');
    }

    /**
     * Menghapus periode dari database.
     */
    public function destroy(Periode $periode)
    {
        // Aturan Bisnis: Jangan hapus periode jika sudah ada permohonan terkait.
        if ($periode->permohonans()->exists()) {
            return redirect()->route('admin.periode.index')->with('error', 'Periode tidak dapat dihapus karena sudah memiliki data permohonan.');
        }

        $periode->delete();

        return redirect()->route('admin.periode.index')->with('success', 'Periode berhasil dihapus.');
    }
}
