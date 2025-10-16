import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header'; // Sesuaikan path jika berbeda
import { usePage } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    const { generalSettings } = usePage().props;
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <PublicHeader />
            {/* 2. Tambahkan 'flex-1' pada main content */}
            <main className="flex-1">{children}</main>
            <PublicFooter settings={generalSettings} />
        </div>
    );
}
