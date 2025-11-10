import PublicLayout from '@/layouts/publicLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PageHeader from './partials/PageHeader';
import StrukturContent from './partials/StrukturContent';
import StrukturLightbox from './partials/StrukturLightbox';

export default function StrukturOrganisasiPage({ dataStruktur }) {
    const [openLightbox, setOpenLightbox] = useState(false);

    const slides = dataStruktur?.gambar_url
        ? [{ src: dataStruktur.gambar_url }]
        : [];

    return (
        <PublicLayout>
            <Head title="Struktur Organisasi" />

            <PageHeader />

            <StrukturContent
                dataStruktur={dataStruktur}
                onImageClick={() => setOpenLightbox(true)}
            />

            <StrukturLightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={slides}
            />
        </PublicLayout>
    );
}
