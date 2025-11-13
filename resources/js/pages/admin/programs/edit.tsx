import AppLayout from '@/layouts/app-layout';
import {
    AvailablePenyaluran,
    Periode,
    Program,
    ProgramForm,
} from '@/types/program';
import { Head, useForm } from '@inertiajs/react';
import FormActions from './partials/form-actions';
import FormHeader from './partials/form-header';
import PenyaluranLinker from './partials/penyaluran-linker';
import PhotoManager from './partials/photo-manager';
import ProgramDetailsForm from './partials/program-details-form';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Program', href: '/admin/programs' },
    { title: 'Edit Program' },
];

/**
 * @interface EditProps
 * @description Properti untuk halaman Edit Program.
 * @property {Program} program - Data program yang akan diedit.
 * @property {AvailablePenyaluran[]} availablePenyalurans - Daftar penyaluran yang bisa dihubungkan.
 * @property {number[]} linkedPenyaluranIds - ID penyaluran yang sudah terhubung.
 * @property {Periode[]} periodes - Daftar periode untuk filter.
 */
interface EditProps {
    program: Program;
    availablePenyalurans: AvailablePenyaluran[];
    linkedPenyaluranIds: number[];
    periodes: Periode[];
}

/**
 * @page EditProgram
 * @description Halaman untuk mengedit program, menghubungkan penyaluran, dan mengelola foto.
 * @param {EditProps} props - Properti halaman.
 * @returns {JSX.Element}
 */
export default function Edit({
    program,
    availablePenyalurans,
    linkedPenyaluranIds,
    periodes,
}: EditProps) {
    const { data, setData, post, processing, errors } = useForm<ProgramForm>({
        _method: 'PUT',
        name: program.name || '',
        description: program.description || '',
        program_date: program.program_date || '',
        status: program.status || 'Draft',
        photos: [],
        deleted_photos: [],
        penyaluran_ids: linkedPenyaluranIds || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gunakan `post` karena Inertia akan menangani method `PUT` via `_method`
        post(`/admin/programs/${program.id}`, {
            forceFormData: true, // Diperlukan untuk upload file
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Program: ${program.name}`} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <FormHeader
                        title="Edit Program"
                        description={`Memperbarui detail untuk "${program.name}".`}
                        backUrl="/admin/programs"
                    />

                    <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
                        <div className="flex flex-col gap-6 lg:col-span-2">
                            <ProgramDetailsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                            <PenyaluranLinker
                                availablePenyalurans={availablePenyalurans}
                                periodes={periodes}
                                linkedIds={data.penyaluran_ids as number[]}
                                setData={setData}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <PhotoManager
                                existingPhotos={program.photos}
                                setData={setData}
                                errors={errors}
                            />
                        </div>
                    </div>

                    <FormActions
                        processing={processing}
                        backUrl="/admin/programs"
                        submitText="Simpan Perubahan"
                        processingText="Memperbarui..."
                    />
                </form>
            </div>
        </AppLayout>
    );
}