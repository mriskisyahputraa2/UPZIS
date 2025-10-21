<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Program;
use App\Models\ProgramPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProgramController extends Controller
{
    /**
     * Menampilkan daftar semua program.
     */
    public function index(Request $request)
    {
        // Validasi semua kemungkinan input filter
        $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Draft,Published',
            'periode_id' => 'nullable|integer|exists:periodes,id',
        ]);

        $programs = Program::withCount('photos', 'penyalurans')
            ->withSum('penyalurans', 'amount')
            // Filter berdasarkan pencarian nama
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            // Filter berdasarkan status
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            // Filter berdasarkan periode penyaluran
            ->when($request->input('periode_id'), function ($query, $periodeId) {
                $query->whereHas('penyalurans.permohonan', function ($q) use ($periodeId) {
                    $q->where('periode_id', $periodeId);
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 5))
            ->withQueryString();

        return Inertia::render('admin/programs/index', [
            'programs' => $programs,
            'filters' => $request->only(['search', 'status', 'periode_id', 'per_page']),
            'periodes' => Periode::latest()->get(['id', 'name']), // Kirim data periode untuk filter
        ]);
    }

    /**
     * Menampilkan form untuk membuat program baru.
     */
    public function create()
    {
        return Inertia::render('admin/programs/create');
    }

    /**
     * Menyimpan program baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'program_date' => 'required|date',
            'status' => 'required|string|in:Draft,Published',
            'photos' => 'nullable|array',
            'photos.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $program = Program::create($request->only(['name', 'description', 'program_date', 'status']));

            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $path = $photo->store('program-photos/' . $program->id, 'public');
                    $program->photos()->create(['photo_path' => $path]);
                }
            }

            DB::commit();

            // return redirect()->route('admin.programs.index')->with('success', 'Program baru berhasil dibuat.');
        return redirect()->route('admin.programs.edit', $program)->with('success', 'Program baru berhasil dibuat. Silakan hubungkan data penyaluran.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan saat menyimpan program.');
        }
    }

    /**
     * Menampilkan form untuk mengedit program.
     */
    public function edit(Program $program)
    {
        $program->load('photos');

        $availablePenyalurans = Penyaluran::with('permohonan.mustahik')->whereNull('program_id')->orWhere('program_id', $program->id)->latest('distribution_date')->get();

        $linkedPenyaluranIds = $program->penyalurans()->pluck('id')->toArray();

        // ambil semua periode
        $periodes = Periode::latest()->get(['id', 'name']);

        return Inertia::render('admin/programs/edit', [
            'program' => $program,
            'availablePenyalurans' => $availablePenyalurans,
            'linkedPenyaluranIds' => $linkedPenyaluranIds,
            'periodes' => $periodes,
        ]);
    }

    /**
     * Memperbarui data program di database.
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'program_date' => 'required|date',
            'status' => 'required|string|in:Draft,Published',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'deleted_photos' => 'nullable|array',
            'deleted_photos.*' => 'integer|exists:program_photos,id',
            'penyaluran_ids' => 'nullable|array',
            'penyaluran_ids.*' => 'integer|exists:penyalurans,id',
        ]);

        try {
            DB::beginTransaction();

            $program->update($request->only(['name', 'description', 'program_date', 'status']));

            if ($request->filled('deleted_photos')) {
                $photosToDelete = ProgramPhoto::whereIn('id', $request->deleted_photos)->get();
                foreach ($photosToDelete as $photo) {
                    Storage::disk('public')->delete($photo->photo_path);
                    $photo->delete();
                }
            }

            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $path = $photo->store('program-photos/' . $program->id, 'public');
                    $program->photos()->create(['photo_path' => $path]);
                }
            }

            // Sinkronisasi data penyaluran
            Penyaluran::where('program_id', $program->id)->update(['program_id' => null]);
            if ($request->filled('penyaluran_ids')) {
                Penyaluran::whereIn('id', $request->penyaluran_ids)->update(['program_id' => $program->id]);
            }

            DB::commit();

            // return back()->with('success', 'Program berhasil diperbarui.');
            return redirect()->route('admin.programs.index')->with('success', 'Program berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan saat memperbarui program.');
        }
    }

    /**
     * Menghapus program dari database.
     */
    public function destroy(Program $program)
    {
        // Hapus folder foto dari storage
        Storage::disk('public')->deleteDirectory('program-photos/' . $program->id);

        // Hapus program (cascade akan menghapus foto, set null akan melepaskan penyaluran)
        $program->delete();

        return redirect()->route('admin.programs.index')->with('success', 'Program berhasil dihapus.');
    }
}
