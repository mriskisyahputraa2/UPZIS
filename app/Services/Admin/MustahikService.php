<?php

namespace App\Services\Admin;

use App\Exports\MustahiksExport;
use App\Http\Requests\Admin\StoreMustahikRequest;
use App\Http\Requests\Admin\UpdateMustahikRequest;
use App\Models\Mustahik;
use App\Models\Periode;
use App\Models\Penyaluran;
use App\Models\Setting;
use App\Models\Transaksi;
use App\Repositories\Admin\MustahikRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Validation\ValidationException;

/**
 * @summary Service untuk mengelola logika bisnis Mustahik.
 *
 * @description
 * Kelas ini menangani semua operasi bisnis yang kompleks terkait mustahik,
 * seperti pembuatan, pembaruan, penghapusan, perhitungan dana, dan ekspor data.
 * Ini bertindak sebagai perantara antara Controller dan Repository.
 */
class MustahikService
{
    /**
     * @param MustahikRepository $mustahikRepository
     */
    public function __construct(protected MustahikRepository $mustahikRepository)
    {
    }

    /**
     * @summary Membuat data mustahik baru beserta permohonan dan dokumennya.
     *
     * @param StoreMustahikRequest $request
     * @return Mustahik
     * @throws \Exception
     */
    public function createMustahik(StoreMustahikRequest $request): Mustahik
    {
        $activePeriode = $this->mustahikRepository->getActivePeriode();
        if (!$activePeriode) {
            throw new \Exception('Tidak ada periode pendaftaran yang aktif.');
        }

        $this->validateUniqueness($request->validated(), $activePeriode);

        return DB::transaction(function () use ($request, $activePeriode) {
            $validated = $request->validated();

            // Siapkan data untuk model Mustahik, pastikan nilai default yang benar
            $mustahikData = [
                'nik' => $validated['nik'],
                'name' => $validated['name'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'kk_number' => $validated['kk_number'],
                'phone_number' => $validated['phone_number'],
                'address' => $validated['address'],
                'pekerjaan' => $validated['pekerjaan'] ?? null,
                'jumlah_tanggungan' => $validated['jumlah_tanggungan'] ?? 0, // Memastikan nilai 0 jika null
                'status_rumah' => $validated['status_rumah'] ?? null,
            ];

            $folderPath = $validated['kategori_pemohon'] === 'mahasiswa' ? 'mustahik-mahasiswa' : 'mustahik-umum';
            $mustahikData['photo'] = $request->file('photo')->store($folderPath, 'public');

            $mustahik = $this->mustahikRepository->updateOrCreateMustahik($mustahikData);

            $permohonan = $this->mustahikRepository->createPermohonan($mustahik, $validated, $activePeriode->id);

            if ($validated['kategori_pemohon'] === 'umum') {
                $this->uploadPermohonanDocuments($request, $permohonan->id);
            }

            return $mustahik;
        });
    }

    /**
     * @summary Memperbarui data mustahik, permohonan, dan dokumen.
     *
     * @param UpdateMustahikRequest $request
     * @param Mustahik $mustahik
     * @return Mustahik
     * @throws \Exception
     */
    public function updateMustahik(UpdateMustahikRequest $request, Mustahik $mustahik): Mustahik
    {
        return DB::transaction(function () use ($request, $mustahik) {
            $validated = $request->validated();

            // Siapkan data untuk model Mustahik, pastikan nilai default yang benar
            $mustahikData = [
                'name' => $validated['name'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'nik' => $validated['nik'],
                'kk_number' => $validated['kk_number'],
                'phone_number' => $validated['phone_number'],
                'address' => $validated['address'],
                'pekerjaan' => $validated['pekerjaan'] ?? null,
                'jumlah_tanggungan' => $validated['jumlah_tanggungan'] ?? 0, // Memastikan nilai 0 jika null
                'status_rumah' => $validated['status_rumah'] ?? null,
            ];

            if ($request->hasFile('photo')) {
                if ($mustahik->photo) {
                    Storage::disk('public')->delete($mustahik->photo);
                }
                $folderPath = $validated['kategori_pemohon'] === 'mahasiswa' ? 'mustahik-mahasiswa' : 'mustahik-umum';
                $mustahikData['photo'] = $request->file('photo')->store($folderPath, 'public');
            }

            $mustahik->update($mustahikData);

            $permohonan = $mustahik->permohonans()->latest()->first();
            if ($permohonan) {
                $permohonan->update(['kategori_pemohon' => $validated['kategori_pemohon']]);
                $this->uploadPermohonanDocuments($request, $permohonan->id, true);
            }

            return $mustahik;
        });
    }

    /**
     * @summary Menghapus data mustahik beserta semua file terkait.
     *
     * @param Mustahik $mustahik
     * @return void
     */
    public function deleteMustahik(Mustahik $mustahik): void
    {
        DB::transaction(function () use ($mustahik) {
            if ($mustahik->photo) {
                Storage::disk('public')->delete($mustahik->photo);
            }

            foreach ($mustahik->permohonans as $permohonan) {
                if ($permohonan->dokumen) {
                    $files = $permohonan->dokumen->getAttributes();
                    foreach ($files as $key => $path) {
                        if (Str::startsWith($key, 'file_') && $path) {
                            Storage::disk('public')->delete($path);
                        }
                    }
                }
            }

            $mustahik->delete();
        });
    }

    /**
     * @summary Menyiapkan data untuk halaman detail mustahik.
     *
     * @param Mustahik $mustahik
     * @return array
     */
    public function getMustahikDetails(Mustahik $mustahik): array
    {
        $alokasiPersen = (float) Setting::where('setting_key', 'alokasi_fakir_miskin_persen')->value('setting_value') ?: 10;
        $persenFakirMiskin = $alokasiPersen / 100;
        $persenKampus = 1 - $persenFakirMiskin;

        $totalDanaZakat = Transaksi::where('status', 'Berhasil')->where('type', 'zakat')->sum('final_amount');
        $totalInfaqTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'infaq')->sum('final_amount');
        $totalSedekahTerkumpul = Transaksi::where('status', 'Berhasil')->where('type', 'sedekah')->sum('final_amount');

        $penyaluranFakirMiskin = Penyaluran::where('kategori_alokasi', 'fakir_miskin')->sum('amount');
        $penyaluranKampus = Penyaluran::where('kategori_alokasi', 'kampus')->sum('amount');
        $penyaluranInfaq = Penyaluran::where('kategori_alokasi', 'infaq')->sum('amount');
        $penyaluranSedekah = Penyaluran::where('kategori_alokasi', 'sedekah')->sum('amount');

        return [
            'mustahik' => $this->mustahikRepository->loadShowRelations($mustahik),
            'availableFunds' => [
                'sisaDanaKampus' => $totalDanaZakat * $persenKampus - $penyaluranKampus,
                'sisaDanaFakirMiskin' => $totalDanaZakat * $persenFakirMiskin - $penyaluranFakirMiskin,
                'sisaDanaInfaq' => $totalInfaqTerkumpul - $penyaluranInfaq,
                'sisaDanaSedekah' => $totalSedekahTerkumpul - $penyaluranSedekah,
            ],
        ];
    }

    /**
     * @summary Menangani proses ekspor data mustahik ke Excel atau PDF.
     *
     * @param Request $request
     * @param string $type 'excel' or 'pdf'
     * @return BinaryFileResponse
     */
    public function export(Request $request, string $type): BinaryFileResponse
    {
        $fileName = $this->generateDynamicFileName($request, $type === 'excel' ? '.xlsx' : '.pdf');
        $export = new MustahiksExport($request);

        if ($type === 'excel') {
            return Excel::download($export, $fileName);
        }

        $mustahiks = $export->query()->get();
        $filtersDescription = $this->getFiltersDescription($request);
        $pdf = Pdf::loadView('reports.mustahik', compact('mustahiks', 'filtersDescription'));

        return $pdf->setPaper('a4', 'landscape')->download($fileName);
    }

    /**
     * @summary Validasi keunikan NIK dan No. KK sebelum menyimpan.
     *
     * @param array $data
     * @param Periode $activePeriode
     * @throws ValidationException
     */
    private function validateUniqueness(array $data, Periode $activePeriode): void
    {
        $errors = [];
        $mustahikByNik = $this->mustahikRepository->findByNik($data['nik']);
        $mustahikByKk = $this->mustahikRepository->findByKkNumber($data['kk_number']);

        if ($mustahikByNik && $this->mustahikRepository->hasPermohonanInPeriod($mustahikByNik->id, $activePeriode->id)) {
            $errors['nik'] = 'Mustahik dengan NIK ini sudah terdaftar pada periode bantuan ini.';
        }

        if ($mustahikByKk && (!$mustahikByNik || $mustahikByNik->id !== $mustahikByKk->id)) {
            $errors['kk_number'] = 'No. KK ini sudah terdaftar untuk NIK yang berbeda.';
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * @summary Mengunggah dokumen-dokumen permohonan.
     *
     * @param Request $request
     * @param int $permohonanId
     * @param bool $isUpdate
     */
    private function uploadPermohonanDocuments(Request $request, int $permohonanId, bool $isUpdate = false): void
    {
        $dokumen = $isUpdate
            ? \App\Models\PermohonanDokumen::firstOrNew(['permohonan_id' => $permohonanId])
            : new \App\Models\PermohonanDokumen(['permohonan_id' => $permohonanId]);

        $fileKeys = [
            'file_sktm' => 'file_surat_fakir_miskin',
            'file_rumah_depan' => 'file_rumah_depan',
            'file_rumah_belakang' => 'file_rumah_belakang',
            'file_rumah_kiri' => 'file_rumah_kiri',
            'file_rumah_kanan' => 'file_rumah_kanan',
        ];

        $hasNewFiles = false;
        foreach ($fileKeys as $requestKey => $dbColumn) {
            if ($request->hasFile($requestKey)) {
                $hasNewFiles = true;
                if ($isUpdate && $dokumen->{$dbColumn}) {
                    Storage::disk('public')->delete($dokumen->{$dbColumn});
                }
                $dokumen->{$dbColumn} = $request->file($requestKey)->store("permohonan_files/{$permohonanId}", 'public');
            }
        }

        if ($hasNewFiles || !$isUpdate) {
            $dokumen->save();
        }
    }

    /**
     * @summary Membuat nama file dinamis untuk ekspor.
     *
     * @param Request $request
     * @param string $extension
     * @return string
     */
    private function generateDynamicFileName(Request $request, string $extension): string
    {
        $parts = ['laporan-mustahik'];
        if ($request->filled('kategori_pemohon')) {
            $parts[] = $request->input('kategori_pemohon') === 'umum' ? 'fakir-miskin' : 'mahasiswa';
        }
        if ($request->filled('jenis_kelamin')) {
            $parts[] = $request->input('jenis_kelamin');
        }
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $parts[] = 'periode-' . $periode->name;
            }
        }
        $parts[] = now()->format('d-m-Y');

        return Str::slug(implode('-', $parts)) . $extension;
    }

    /**
     * @summary Mendapatkan deskripsi filter yang aktif untuk laporan.
     *
     * @param Request $request
     * @return array
     */
    private function getFiltersDescription(Request $request): array
    {
        $desc = [];
        if ($request->filled('kategori_pemohon')) {
            $desc['Kategori'] = $request->input('kategori_pemohon') === 'umum' ? 'Fakir/Miskin' : 'Mahasiswa';
        }
        if ($request->filled('jenis_kelamin')) {
            $desc['Jenis Kelamin'] = $request->input('jenis_kelamin');
        }
        if ($request->filled('periode_id')) {
            $periode = Periode::find($request->input('periode_id'));
            if ($periode) {
                $desc['Periode'] = $periode->name;
            }
        }
        if ($request->filled('search')) {
            $desc['Pencarian'] = '"' . $request->input('search') . '"';
        }
        return $desc;
    }
}
