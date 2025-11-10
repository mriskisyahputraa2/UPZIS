import PublicLayout from '@/layouts/publicLayout';
import { Head } from '@inertiajs/react';
import NoProgramsFound from './partials/NoProgramsFound';
import PageHeader from './partials/PageHeader';
import ProgramGrid from './partials/ProgramGrid';

export default function Index({ programs }) {
    return (
        <PublicLayout>
            <Head title="Galeri Program" />
            <PageHeader />
            <section className="-mt-10 pb-16 md:pb-24">
                <div className="container mx-auto max-w-7xl px-4">
                    {programs.data.length > 0 ? (
                        <ProgramGrid programs={programs} />
                    ) : (
                        <NoProgramsFound />
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
