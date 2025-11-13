<?php

namespace App\Services\Admin;

use App\Models\Program;
use App\Repositories\Admin\ProgramRepository;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

/**
 * Class ProgramService
 *
 * Service ini menangani logika bisnis yang terkait dengan pengelolaan program.
 */
class ProgramService
{
    /**
     * @var ProgramRepository
     */
    protected $programRepository;

    /**
     * ProgramService constructor.
     *
     * @param  ProgramRepository  $programRepository
     */
    public function __construct(ProgramRepository $programRepository)
    {
        $this->programRepository = $programRepository;
    }

    /**
     * Membuat program baru beserta foto-fotonya.
     *
     * @param  array  $data
     * @return Program
     *
     * @throws Exception
     */
    public function storeProgram(array $data): Program
    {
        DB::beginTransaction();
        try {
            $programData = Arr::except($data, ['photos']);
            $program = $this->programRepository->create($programData);

            if (isset($data['photos'])) {
                foreach ($data['photos'] as $photo) {
                    $this->programRepository->addPhoto($program, $photo);
                }
            }

            DB::commit();

            return $program;
        } catch (Exception $e) {
            DB::rollBack();
            // Sebaiknya log error di sini
            throw new Exception('Gagal menyimpan program baru: '.$e->getMessage());
        }
    }

    /**
     * Memperbarui data program, foto, dan relasi penyaluran.
     *
     * @param  Program  $program
     * @param  array  $data
     * @return void
     *
     * @throws Exception
     */
    public function updateProgram(Program $program, array $data): void
    {
        DB::beginTransaction();
        try {
            // 1. Update detail dasar program
            $programData = Arr::except($data, ['photos', 'deleted_photos', 'penyaluran_ids']);
            $this->programRepository->update($program, $programData);

            // 2. Hapus foto yang ditandai untuk dihapus
            if (! empty($data['deleted_photos'])) {
                $this->programRepository->deletePhotos($data['deleted_photos']);
            }

            // 3. Tambah foto baru
            if (isset($data['photos'])) {
                foreach ($data['photos'] as $photo) {
                    $this->programRepository->addPhoto($program, $photo);
                }
            }

            // 4. Sinkronisasi data penyaluran
            $penyaluranIds = $data['penyaluran_ids'] ?? [];
            $this->programRepository->syncPenyalurans($program, $penyaluranIds);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            // Sebaiknya log error di sini
            throw new Exception('Gagal memperbarui program: '.$e->getMessage());
        }
    }

    /**
     * Menghapus program beserta direktori fotonya.
     *
     * @param  Program  $program
     * @return void
     *
     * @throws Exception
     */
    public function deleteProgram(Program $program): void
    {
        try {
            // Hapus folder foto dari storage terlebih dahulu
            $this->programRepository->deletePhotoDirectory($program);

            // Hapus program dari database (relasi akan ditangani oleh onDelete cascade/set null)
            $this->programRepository->delete($program);
        } catch (Exception $e) {
            // Sebaiknya log error di sini
            throw new Exception('Gagal menghapus program: '.$e->getMessage());
        }
    }
}
