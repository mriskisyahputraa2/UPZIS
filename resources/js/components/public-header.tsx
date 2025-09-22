// resources/js/components/public-header.jsx

import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const publicNavItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Galeri Program', href: '/galeri' },
    { title: 'Kalkulator Zakat', href: '/kalkulator' },
    { title: 'Ajukan Bantuan', href: '/ajukan-bantuan' },
    { title: 'Kontak', href: '/kontak' },
];

export function PublicHeader() {
    const page = usePage();

    return (
        // UBAH: Latar belakang menjadi hijau dan warna teks default menjadi putih
        <header className="bg-green-600 text-white">
            <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                {/* Mobile Menu */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-2 h-[34px] w-[34px] text-white hover:bg-green-700 hover:text-white"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-64 border-r-green-500 bg-green-600 text-white"
                        >
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <AppLogoIcon className="h-6 w-6" />
                                    <span>Menu</span>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-8 flex flex-col space-y-4">
                                {publicNavItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="font-medium hover:opacity-80"
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                                <hr className="border-green-500" />
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        href="/login"
                                        className="font-medium hover:opacity-80"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-white px-4 py-2 text-center font-semibold text-green-600"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    {/* SVG Anda akan otomatis berwarna putih karena `fill-current` */}
                    <AppLogo />
                </Link>

                {/* Desktop Navigation */}
                <div className="ml-6 hidden h-full items-center lg:flex">
                    <NavigationMenu>
                        <NavigationMenuList className="space-x-1">
                            {publicNavItems.map((item, index) => (
                                <NavigationMenuItem key={index}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            // UBAH: Style link navigasi
                                            'bg-transparent text-white hover:bg-green-700 focus:bg-green-700',
                                            page.url === item.href &&
                                                'bg-green-700 font-semibold',
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Tombol Aksi (Login & Daftar) di Kanan */}
                <div className="ml-auto hidden items-center space-x-4 lg:flex">
                    <Link
                        href="/login"
                        // UBAH: Style tombol login
                        className="text-sm font-medium text-white hover:opacity-80"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        // UBAH: Style tombol daftar agar menonjol
                        className="rounded-md bg-white px-4 py-2 text-sm font-bold text-green-600 hover:bg-gray-200"
                    >
                        Daftar
                    </Link>
                </div>
            </div>
        </header>
    );
}
