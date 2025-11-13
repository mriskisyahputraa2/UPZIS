<?php

namespace App\Repositories\Admin;

use App\Models\Penyaluran;
use App\Models\Periode;
use App\Models\Program;
use App\Models\ProgramPhoto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Class ProgramRepository
 *
 * Repositori ini bertanggung jawab untuk semua interaksi database
 * yang terkait dengan model Program.
 */
class ProgramRepository
{
    /**
     * Mengambil daftar program dengan paginasi dan filter.
     *
     * @param  Request  $request
     * @return LengthAwarePaginator
     */
    public function getPaginated(Request $request): LengthAwarePaginator
    {
        return Program::withCount('photos', 'penyalurans')
            ->withSum('penyalurans', 'amount')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('periode_id'), function ($query, $periodeId) {
                $query->whereHas('penyalurans.permohonan', function ($q) use ($periodeId) {
                    $q->where('periode_id', $periodeId);
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 5))
            ->withQueryString();
    }

    /**
     * Mengambil semua periode untuk filter.
     *
     * @return Collection
     */
    public function getPeriodes(): Collection
    {
        return Periode::latest()->get(['id', 'name']);
    }

    /**
     * Membuat data program baru.
     *
     * @param  array  $data
     * @return Program
     */
    public function create(array $data): Program
    {
        return Program::create($data);
    }

    /**
     * Mengunggah dan menyimpan foto untuk program.
     *
     * @param  Program  $program
     * @param  \Illuminate\Http\UploadedFile  $photo
     * @return ProgramPhoto
     */
    public function addPhoto(Program $program, $photo): ProgramPhoto
    {
        $path = $photo->store('program-photos/'.$program->id, 'public');

        return $program->photos()->create(['photo_path' => $path]);
    }

    /**
     * Memperbarui data program yang ada.
     *
     * @param  Program  $program
     * @param  array  $data
     * @return bool
     */
    public function update(Program $program, array $data): bool
    {
        return $program->update($data);
    }

    /**
     * Menghapus foto-foto program dari database dan storage.
     *
     * @param  array  $photoIds
     * @return void
     */
    public function deletePhotos(array $photoIds): void
    {
        $photosToDelete = ProgramPhoto::whereIn('id', $photoIds)->get();
        foreach ($photosToDelete as $photo) {
            Storage::disk('public')->delete($photo->photo_path);
            $photo->delete();
        }
    }

    /**
     * Sinkronisasi data penyaluran yang terhubung dengan program.
     *
     * @param  Program  $program
     * @param  array  $penyaluranIds
     * @return void
     */
    public function syncPenyalurans(Program $program, array $penyaluranIds): void
    {
        // Lepaskan semua penyaluran yang saat ini terhubung dengan program ini
        Penyaluran::where('program_id', $program->id)->update(['program_id' => null]);

        // Hubungkan penyaluran yang baru dipilih
        if (! empty($penyaluranIds)) {
            Penyaluran::whereIn('id', $penyaluranIds)->update(['program_id' => $program->id]);
        }
    }

    /**
     * Mengambil penyaluran yang tersedia untuk dihubungkan ke program.
     *
     * @param  Program  $program
     * @return Collection
     */
    public function getAvailablePenyalurans(Program $program): Collection
    {
        return Penyaluran::with('permohonan.mustahik')
            ->whereNull('program_id')
            ->orWhere('program_id', $program->id)
            ->latest('distribution_date')
            ->get();
    }

    /**
     * Menghapus direktori foto dari storage.
     *
     * @param  Program  $program
     * @return void
     */
    public function deletePhotoDirectory(Program $program): void
    {
        Storage::disk('public')->deleteDirectory('program-photos/'.$program->id);
    }

    /**
     * Menghapus program dari database.
     *
     * @param  Program  $program
     * @return void
     */
    public function delete(Program $program): void
    {
        $program->delete();
    }
}
