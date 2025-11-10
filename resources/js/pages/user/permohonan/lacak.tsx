import PublicLayout from '@/layouts/publicLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import NotFound from './partials/lacak/NotFound';
import SearchForm from './partials/lacak/SearchForm';
import SearchResult from './partials/lacak/SearchResult';
import FormHeader from './partials/shared/FormHeader';

/**
 * Halaman untuk melacak status permohonan bantuan.
 * Pengguna dapat mencari berdasarkan kode unik atau data diri (NIK/No. HP).
 *
 * @param {object} props - Properti halaman.
 * @param {object | null} props.permohonan - Data permohonan jika ditemukan.
 * @param {object} props.filters - Filter pencarian yang digunakan.
 * @returns {JSX.Element}
 */
export default function Lacak({ permohonan, filters }) {
    const { data, setData, get, processing, errors } = useForm({
        kode: filters.kode || '',
        identifier: filters.identifier || '',
    });

    const [activeTab, setActiveTab] = useState(
        filters.identifier ? 'dataDiri' : 'kodeUnik',
    );

    /**
     * Menangani pengiriman form pencarian.
     * @param {React.FormEvent<HTMLFormElement>} e - Event form.
     */
    const handleSearch = (e) => {
        e.preventDefault();

        const params =
            activeTab === 'kodeUnik'
                ? { kode: data.kode }
                : { identifier: data.identifier };

        get('/lacak-status', {
            data: params,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const wasSearched = filters.kode || filters.identifier;

    return (
        <PublicLayout>
            <Head title="Lacak Status Permohonan" />

            <FormHeader
                title="Lacak Status Permohonan"
                description="Pantau progres permohonan bantuan Anda secara mandiri."
            />

            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-2xl px-6">
                    <SearchForm
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        data={data}
                        setData={setData}
                        handleSearch={handleSearch}
                        processing={processing}
                        errors={errors}
                    />

                    {/* Tampilan Hasil Pencarian */}
                    <div className="mt-8">
                        {permohonan && <SearchResult permohonan={permohonan} />}

                        {wasSearched && !permohonan && !processing && (
                            <NotFound />
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}