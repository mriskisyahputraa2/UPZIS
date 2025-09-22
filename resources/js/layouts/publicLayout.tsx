import { PublicHeader } from '@/components/public-header'; // Sesuaikan path jika berbeda

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />
            <main>{children}</main>
            {/* Anda bisa menambahkan Footer di sini nanti */}
        </div>
    );
}
