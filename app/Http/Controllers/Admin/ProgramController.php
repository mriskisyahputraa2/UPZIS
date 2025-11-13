<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProgramRequest;
use App\Http\Requests\Admin\UpdateProgramRequest;
use App\Models\Program;
use App\Repositories\Admin\ProgramRepository;
use App\Services\Admin\ProgramService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class ProgramController
 *
 * Controller ini menangani semua tindakan terkait manajemen program di area admin.
 */
class ProgramController extends Controller
{
    /**
     * @var ProgramRepository
     */
    protected $programRepository;

    /**
     * @var ProgramService
     */
    protected $programService;

    /**
     * ProgramController constructor.
     *
     * @param  ProgramRepository  $programRepository
     * @param  ProgramService  $programService
     */
    public function __construct(ProgramRepository $programRepository, ProgramService $programService)
    {
        $this->programRepository = $programRepository;
        $this->programService = $programService;
    }

    /**
     * Menampilkan daftar semua program dengan filter dan paginasi.
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        // Validasi sederhana untuk filter bisa tetap di controller
        $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Draft,Published',
            'periode_id' => 'nullable|integer|exists:periodes,id',
        ]);

        $programs = $this->programRepository->getPaginated($request);
        $periodes = $this->programRepository->getPeriodes();

        return Inertia::render('admin/programs/index', [
            'programs' => $programs,
            'filters' => $request->only(['search', 'status', 'periode_id', 'per_page']),
            'periodes' => $periodes,
        ]);
    }

    /**
     * Menampilkan form untuk membuat program baru.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('admin/programs/create');
    }

    /**
     * Menyimpan program baru ke database.
     *
     * @param  StoreProgramRequest  $request
     * @return RedirectResponse
     */
    public function store(StoreProgramRequest $request): RedirectResponse
    {
        try {
            $program = $this->programService->storeProgram($request->validated());

            return redirect()->route('admin.programs.edit', $program)->with('success', 'Program baru berhasil dibuat. Silakan hubungkan data penyaluran.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Menampilkan form untuk mengedit program.
     *
     * @param  Program  $program
     * @return Response
     */
    public function edit(Program $program): Response
    {
        $program->load('photos');
        $availablePenyalurans = $this->programRepository->getAvailablePenyalurans($program);
        $linkedPenyaluranIds = $program->penyalurans()->pluck('id')->toArray();
        $periodes = $this->programRepository->getPeriodes();

        return Inertia::render('admin/programs/edit', [
            'program' => $program,
            'availablePenyalurans' => $availablePenyalurans,
            'linkedPenyaluranIds' => $linkedPenyaluranIds,
            'periodes' => $periodes,
        ]);
    }

    /**
     * Memperbarui data program di database.
     *
     * @param  UpdateProgramRequest  $request
     * @param  Program  $program
     * @return RedirectResponse
     */
    public function update(UpdateProgramRequest $request, Program $program): RedirectResponse
    {
        try {
            $this->programService->updateProgram($program, $request->validated());

            return redirect()->route('admin.programs.index')->with('success', 'Program berhasil diperbarui.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Menghapus program dari database.
     *
     * @param  Program  $program
     * @return RedirectResponse
     */
    public function destroy(Program $program): RedirectResponse
    {
        try {
            $this->programService->deleteProgram($program);

            return redirect()->route('admin.programs.index')->with('success', 'Program berhasil dihapus.');
        } catch (Exception $e) {
            return redirect()->route('admin.programs.index')->with('error', $e->getMessage());
        }
    }
}