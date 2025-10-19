import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetClose,
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
    HandHeart,
    Home,
    Image,
    LayoutDashboard,
    LogIn,
    LogOut,
    Mail,
    Menu,
    Search,
    User,
    UserPlus,
    X,
} from 'lucide-react';
import { useState } from 'react';

// Data navigasi untuk link teks biasa
const textNavItems = [
    { title: 'Beranda', href: '/', icon: Home },
    { title: 'Galeri Program', href: '/galeri', icon: Image },
    { title: 'Kalkulator Zakat', href: '/kalkulator-zakat', icon: Calculator },
    { title: 'Lacak Status', href: '/lacak-status', icon: Search },
    { title: 'Kontak', href: '/kontak', icon: Mail },
];

// Gabungkan semua item untuk digunakan di menu mobile
const allNavItems = [
    { title: 'Beranda', href: '/', icon: Home },
    { title: 'Donasi', href: '/donasi', icon: HandHeart },
    { title: 'Galeri Program', href: '/galeri', icon: Image },
    { title: 'Kalkulator Zakat', href: '/kalkulator-zakat', icon: Calculator },
    { title: 'Ajukan Bantuan', href: '/ajukan-bantuan', icon: FileText },
    { title: 'Lacak Status', href: '/lacak-status', icon: Search },
    { title: 'Kontak', href: '/kontak', icon: Mail },
];

// Helper untuk mendapatkan inisial
const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export function PublicHeader() {
    const { props, url } = usePage();
    const { auth } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAdmin =
        auth.user &&
        (auth.user.role === 'admin' || auth.user.role === 'superadmin');
    const isActive = (href) => {
        const currentPath = url.split('?')[0];
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    const NavLink = ({ item }) => (
        <Link
            href={item.href}
            className={cn(
                'group relative py-2 text-base font-medium transition-colors duration-300 hover:text-white',
                isActive(item.href) ? 'text-white' : 'text-white/80',
            )}
        >
            <span>{item.title}</span>
            <span
                className={cn(
                    'absolute bottom-1.5 left-0 h-0.5 w-full origin-left transform bg-white transition-transform duration-300 ease-out',
                    isActive(item.href)
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100',
                )}
            ></span>
        </Link>
    );

    return (
        <header className="absolute top-0 left-0 z-30 w-full text-white">
            <div className="container mx-auto flex h-20 items-center justify-between gap-8 px-4 md:max-w-7xl">
                <div className="flex flex-1 items-center justify-start gap-8">
                    <AppLogo />
                    {/* Navigasi Teks Sederhana */}
                    <nav className="hidden lg:flex">
                        <ul className="flex items-center gap-8">
                            {textNavItems.map((item) => (
                                <li key={item.title}>
                                    <NavLink item={item} />
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Tombol Aksi & Menu User */}
                <div className="flex items-center space-x-2">
                    <div className="hidden items-center space-x-2 lg:flex">
                        <Link href="/ajukan-bantuan">
                            <Button
                                variant="outline"
                                className="border-white/50 bg-transparent text-white hover:bg-white hover:text-green-700"
                            >
                                Ajukan Bantuan
                            </Button>
                        </Link>
                        <Link href="/donasi">
                            <Button className="bg-white font-bold text-green-700 shadow-lg hover:bg-gray-200">
                                Donasi Sekarang
                            </Button>
                        </Link>

                        {auth.user ? (
                            <div className="pl-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-9 w-9 rounded-full"
                                        >
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    key={auth.user.photo_url}
                                                    src={auth.user.photo_url}
                                                    alt={auth.user.name}
                                                />
                                                <AvatarFallback className="bg-green-200 font-bold text-green-800">
                                                    {getInitials(
                                                        auth.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="truncate text-sm leading-none font-medium">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile">
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Profil Saya</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            {isAdmin && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin/dashboard">
                                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                                        <span>Dashboard</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Logout</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 pl-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-white transition hover:opacity-80"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Trigger Mobile */}
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
                            <SheetContent
                                side="right"
                                className="flex w-80 flex-col border-l-0 bg-green-700 p-0 text-white [&>button]:hidden"
                            >
                                <div className="absolute inset-0 bg-[url('/images/islamic-pattern.svg')] opacity-5"></div>
                                <SheetHeader className="relative z-10 border-b border-green-600/50 py-4 pr-12 pl-4 text-left">
                                    {auth.user ? (
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    key={auth.user.photo_url}
                                                    src={auth.user.photo_url}
                                                    alt={auth.user.name}
                                                />
                                                <AvatarFallback className="bg-green-200 text-lg font-bold text-green-800">
                                                    {getInitials(
                                                        auth.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="overflow-hidden">
                                                <SheetTitle className="truncate text-white">
                                                    {auth.user.name}
                                                </SheetTitle>
                                                <p className="text-sm text-green-200">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <SheetTitle>
                                            <AppLogo
                                                className="h-8 w-auto text-white"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            />
                                        </SheetTitle>
                                    )}
                                    <SheetClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
                                        <X className="h-6 w-6" />
                                        <span className="sr-only">Close</span>
                                    </SheetClose>
                                </SheetHeader>
                                <div className="relative z-10 flex flex-1 flex-col justify-between overflow-y-auto">
                                    <nav className="flex flex-col space-y-1 p-6">
                                        {allNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-white/10',
                                                    isActive(item.href)
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
                                                        isActive(item.href)
                                                            ? 'text-white'
                                                            : 'text-green-300',
                                                    )}
                                                />
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="mt-auto border-t border-green-600/50 p-6">
                                        {auth.user ? (
                                            <div className="flex flex-col space-y-1">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-green-200 transition-colors hover:bg-white/10"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <User className="h-5 w-5 text-green-300" />
                                                    <span>Profil Saya</span>
                                                </Link>
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        className="flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-green-200 transition-colors hover:bg-white/10"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                    >
                                                        <LayoutDashboard className="h-5 w-5 text-green-300" />
                                                        <span>Dashboard</span>
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-base font-medium text-green-200 transition-colors hover:bg-white/10"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <LogOut className="h-5 w-5 text-green-300" />
                                                    <span>Logout</span>
                                                </Link>
                                            </div>
                                        ) : (
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
                                        )}
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
