import PublicLayout from '@/layouts/publicLayout';
import { Head } from '@inertiajs/react';
import CallToActionSection from './partials/CallToActionSection';
import FaqSection from './partials/FaqSection';
import GaleriProgramSection from './partials/GaleriProgramSection';
import HeroSection from './partials/HeroSection';
import LayananSection from './partials/LayananSection';
import StatsSection from './partials/StatsSection';

export default function Homepage({ muzakkiCount, mustahikCount, programs }) {
    return (
        <PublicLayout>
            <Head title="Beranda" />

            <HeroSection />

            <StatsSection
                muzakkiCount={muzakkiCount}
                mustahikCount={mustahikCount}
            />

            <LayananSection />

            <GaleriProgramSection programs={programs} />

            <FaqSection />

            <CallToActionSection />
        </PublicLayout>
    );
}
