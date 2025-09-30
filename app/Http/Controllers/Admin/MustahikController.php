<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MustahikController extends Controller
{
    // Menampilkan halaman daftar mustahik
    public function index(Request $request)
    {
        $request->validate([
            'periode_id' => 'nullable|integer|exists:periodes,id',
        ]);

        // 2. Cari periode yang aktif untuk ditampilkan di header dan sebagai filter default
        $activePeriode = Periode::where('status', 'Aktif')->first();

        // 3. Bangun query secara dinamis
        $mustahiksQuery = Mustahik::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")->orWhere('nik', 'like', "%{$search}%");
            })
            // 4. Tambahkan logika filter berdasarkan periode
            ->when($request->filled('periode_id'), function ($query, $periode_id) {
                // Jika user memilih periode spesifik dari filter, gunakan itu.
                $query->whereHas('permohonans', function ($q) use ($periode_id) {
                    $q->where('periode_id', $periode_id);
                });
            })
            ->when(!$request->has('periode_id') && $activePeriode, function ($query) use ($activePeriode) {
                // Jika halaman baru dimuat (tidak ada filter di URL), default ke periode aktif.
                $query->whereHas('permohonans', function ($q) use ($activePeriode) {
                    $q->where('periode_id', $activePeriode->id);
                });
            });

        $mustahiks = $mustahiksQuery->latest()->paginate($request->input('per_page', 5))->withQueryString();

        // 5. Ambil semua periode untuk dropdown filter
        $periodes = Periode::latest()->get(['id', 'name']);

        // 6. Pastikan filter yang dikirim ke frontend sesuai dengan yang diterapkan
        $currentFilters = $request->only(['search', 'per_page', 'periode_id']);
        if (!$request->has('periode_id') && $activePeriode) {
            $currentFilters['periode_id'] = $activePeriode->id;
        }

        // 7. Mengirim semua data yang dibutuhkan ke frontend
        return Inertia::render('admin/mustahiks/index', [
            'mustahiks' => $mustahiks,
            'filters' => $currentFilters,
            'periodes' => $periodes,
            'activePeriode' => $activePeriode,
        ]);
    }

    // Menampilkan form untuk menambah mustahik baru
    public function create()
    {
        if (!Periode::where('status', 'Aktif')->exists()) {
            return redirect()->route('admin.mustahiks.index')->with('error', 'Tidak ada periode aktif. Silakan aktifkan satu periode untuk menambah data mustahik.');
        }
        return Inertia::render('admin/mustahiks/create');
    }

    // Menyimpan data mustahik baru ke database
    public function store(Request $request)
    {
        $activePeriode = Periode::where('status', 'Aktif')->first();
        if (!$activePeriode) {
            return redirect()->route('admin.mustahiks.index')->with('error', 'Gagal menyimpan data karena tidak ada periode pendaftaran yang aktif.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:mustahiks',
            'kk_number' => 'required|string|size:16|unique:mustahiks',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $data = $request->all();
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('mustahik-photos', 'public');
                $data['photo'] = $photoPath;
            }

            // Langkah 1: Buat data Mustahik baru
            $mustahik = Mustahik::create($data);

            // Langkah 2: Generate kode unik untuk permohonan
            $uniqueCode = 'UPZ-' . time() . Str::upper(Str::random(4));

            // Langkah 3: Buat data Permohonan baru dan hubungkan dengan Mustahik & Periode Aktif
            Permohonan::create([
                'mustahik_id' => $mustahik->id,
                'periode_id' => $activePeriode->id,
                'unique_code' => $uniqueCode,
                'status' => 'Baru', // Status default
                // File dokumen akan kosong karena ditambahkan oleh Admin
            ]);

            DB::commit();

            return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil ditambahkan dan permohonan telah dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Optional: Log error untuk debugging
            // \Log::error('Gagal saat Admin menambah mustahik: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan pada sistem. Silakan coba lagi.');
        }
    }
    // Menampilkan form untuk mengedit data mustahik
    public function edit(Mustahik $mustahik)
    {
        return Inertia::render('admin/mustahiks/edit', [
            'mustahik' => $mustahik,
        ]);
    }

    // Memperbarui data mustahik di database

    public function update(Request $request, Mustahik $mustahik)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahik->id)],
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'kk_number' => ['required', 'string', 'size:16', Rule::unique('mustahiks')->ignore($mustahik->id)],
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Ambil semua data yang tervalidasi kecuali 'photo'
        $updateData = $request->except('photo', '_method');

        // Logika untuk menangani upload atau penghapusan foto
        if ($request->hasFile('photo')) {
            // Jika ada foto baru diupload
            // 1. Hapus foto lama dari storage
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
            }
            // 2. Simpan foto baru dan dapatkan path-nya
            $updateData['photo'] = $request->file('photo')->store('mustahiks', 'public');
        } elseif ($request->input('remove_photo')) {
            // Jika user secara eksplisit meminta menghapus foto (tanpa mengganti)
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
            }
            $updateData['photo'] = null;
        }
        // Jika tidak ada aksi terkait foto, jangan lakukan apa-apa, foto lama akan tetap ada.

        $mustahik->update($updateData);

        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil diperbarui.');
    }

    // Menghapus data mustahik dari database
    public function destroy(Mustahik $mustahik)
    {
        // $mustahik->delete();
        // return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil dihapus.');
        // TAMBAHAN: Hapus foto dari storage jika ada sebelum menghapus record
        if ($mustahik->photo) {
            Storage::disk('public')->delete($mustahik->photo);
        }

        // Hapus record dari database
        $mustahik->delete();

        return redirect()->route('admin.mustahiks.index')->with('success', 'Data Mustahik berhasil dihapus.');
    }

    public function show(Mustahik $mustahik)
    {
        $mustahik->load([
            'permohonans' => function ($query) {
                $query->with('periode')->latest(); // Urutkan permohonan dari yang terbaru
            },
        ]);
        return Inertia::render('admin/mustahiks/show', [
            'mustahik' => $mustahik,
        ]);
    }
}
