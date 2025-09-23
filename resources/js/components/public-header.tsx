import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
    Calculator,
    FileText,
    Home,
    Image,
    LogIn,
    Mail,
    Menu,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';

// Data untuk link navigasi utama DENGAN IKON
const publicNavItems = [
    { title: 'Beranda', href: '/', icon: Home },
    { title: 'Galeri Program', href: '/galeri', icon: Image },
    { title: 'Kalkulator Zakat', href: '/kalkulator', icon: Calculator },
    { title: 'Ajukan Bantuan', href: '/ajukan-bantuan', icon: FileText },
    { title: 'Kontak', href: '/kontak', icon: Mail },
];

export function PublicHeader() {
    const page = usePage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="absolute top-0 left-0 z-30 w-full text-white">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:max-w-7xl">
                {/* Logo selalu di kiri */}
                <Link href="/" className="flex shrink-0 items-center space-x-2">
                    <AppLogo />
                </Link>

                {/* Navigasi Desktop di tengah */}
                <nav className="hidden lg:flex">
                    <ul className="flex items-center">
                        {publicNavItems.map((item, index) => (
                            <li key={index} className="px-4">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'group relative py-2 text-base font-medium transition-colors duration-300 hover:text-white',
                                        page.url === item.href
                                            ? 'text-white'
                                            : 'text-white/80',
                                    )}
                                >
                                    <span>{item.title}</span>
                                    {/* Efek Garis Bawah Penuh dari Kiri ke Kanan */}
                                    <span
                                        className={cn(
                                            'absolute bottom-1.5 left-0 h-0.5 w-full origin-left transform bg-white transition-transform duration-300 ease-out',
                                            page.url === item.href
                                                ? 'scale-x-100'
                                                : 'scale-x-0 group-hover:scale-x-100',
                                        )}
                                    ></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Aksi di kanan */}
                <div className="flex items-center space-x-2">
                    {/* Tombol Aksi untuk Desktop */}
                    <div className="hidden items-center space-x-4 lg:flex">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-white transition hover:opacity-80"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-green-600 transition hover:bg-gray-200"
                        >
                            Daftar
                        </Link>
                    </div>

                    {/* Tombol Menu (Hamburger) & Sheet Content untuk Mobile */}
                    <div className="lg:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-white hover:bg-white/10 hover:text-white"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            {/* ======================================================== */}
                            {/* PERUBAHAN FINAL ADA DI DALAM SHEETCONTENT DI BAWAH INI */}
                            {/* ======================================================== */}
                            <SheetContent
                                side="right"
                                className="flex w-80 flex-col border-l-0 bg-green-700 p-0 text-white"
                            >
                                {/* Latar belakang dengan pola subtil */}
                                <div className="absolute inset-0 bg-[url('/images/islamic-pattern.svg')] opacity-5"></div>

                                <SheetHeader className="relative z-10 border-b border-green-600/50 p-6 text-left">
                                    <SheetTitle>
                                        <Link
                                            href="/"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <AppLogo className="h-8 w-auto" />
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Konten Utama Menu */}
                                <div className="relative z-10 flex flex-1 flex-col justify-between p-6">
                                    <nav className="flex flex-col space-y-1">
                                        {publicNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-white/10 hover:text-white', // Efek hover diubah
                                                    page.url === item.href
                                                        ? 'bg-green-600 text-white'
                                                        : 'text-green-200',
                                                )}
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <item.icon
                                                    className={cn(
                                                        'h-5 w-5',
                                                        page.url === item.href
                                                            ? 'text-white'
                                                            : 'text-green-300',
                                                    )}
                                                />
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </nav>

                                    {/* Tombol Aksi & Kontak di Bawah */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col space-y-3">
                                            <Link
                                                href="/login"
                                                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-center text-base font-medium text-green-100 transition-colors hover:bg-white/10 hover:text-white"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <LogIn className="h-5 w-5" />
                                                <span>Login</span>
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-center text-base font-bold text-green-700 shadow-lg transition hover:bg-gray-200"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <UserPlus className="h-5 w-5" />
                                                <span>Daftar</span>
                                            </Link>
                                        </div>
                                        <div className="text-center text-xs text-green-300">
                                            <p>
                                                &copy;{' '}
                                                {new Date().getFullYear()}{' '}
                                                UPZIS. Hubungi kami di{' '}
                                                <a
                                                    href="mailto:info@upzis.com"
                                                    className="font-semibold hover:underline"
                                                >
                                                    info@upzis.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
