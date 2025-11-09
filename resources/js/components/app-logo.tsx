// resources/js/components/app-logo.tsx (Diperbarui)

import { cn } from '@/lib/utils'; // Import cn jika perlu class tambahan
import { Link } from '@inertiajs/react';

// Impor logo Anda dari folder assets
import logoImage from '../../assets/images/logo-pnl.png';

export default function AppLogo({ className }) {
    return (
        // Gunakan Link agar logo bisa diklik untuk kembali ke beranda
        <Link href="/" className={cn('flex items-center gap-2', className)}>
            {/* Tampilkan gambar logo */}
            <img
                src={logoImage}
                alt="UPZIS Logo"
                className="h-10 w-auto" // Atur ukuran logo di sini
            />
            {/* Tampilkan teks UPZIS */}
            <span className="text-lg leading-tight font-semibold text-inherit">
                UPZIS
            </span>
        </Link>
    );
}
