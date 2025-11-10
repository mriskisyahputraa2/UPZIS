import PublicLayout from '@/layouts/publicLayout';
import { Head } from '@inertiajs/react';
import CallToAction from './partials/show/CallToAction';
import PageHeader from './partials/show/PageHeader';
import ProgramDetails from './partials/show/ProgramDetails';
import StatsSidebar from './partials/show/StatsSidebar';

export default function Show({ program }) {
    return (
        <PublicLayout>
            <Head title={program.name} />
            <PageHeader title={program.name} />
            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                        <ProgramDetails program={program} />
                        <StatsSidebar program={program} />
                    </div>
                </div>
            </section>
            <CallToAction />
        </PublicLayout>
    );
}
