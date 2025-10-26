import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
// import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import {
    BookType,
    Calendar,
    ClipboardList,
    FileText,
    GalleryHorizontal,
    HandCoins,
    Inbox,
    LayoutGrid,
    Settings,
    SlidersHorizontal,
    UserCog,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Master Data',
        icon: BookType,
        subItems: [
            {
                title: 'Manajemen Mustahik',
                href: '/admin/mustahiks',
                icon: Users,
            },
            {
                title: 'Manajemen Periode',
                href: '/admin/periode',
                icon: Calendar,
            },
            {
                title: 'Jenis Zakat',
                href: '/admin/settings/zakat-types',
                icon: BookType,
            },
        ],
    },
    {
        title: 'Transaksi',
        icon: Wallet,
        subItems: [
            {
                title: 'Verifikasi Transaksi',
                href: '/admin/transaksi',
                icon: ClipboardList,
            },
            {
                title: 'Penyaluran Bantuan',
                href: '/admin/laporan-penyaluran',
                icon: HandCoins,
            },
        ],
    },
    {
        title: 'Permohonan Bantuan',
        href: '/admin/permohonan',
        icon: FileText,
    },
    {
        title: 'Konten & Program',
        icon: GalleryHorizontal,
        subItems: [
            {
                title: 'Manajemen Program',
                href: '/admin/programs',
                icon: GalleryHorizontal,
            },
            {
                title: 'Pesan Masuk',
                href: '/admin/kontak',
                icon: Inbox,
            },
        ],
    },
    {
        title: 'Pengaturan',
        icon: Settings,
        subItems: [
            {
                title: 'Umum',
                href: '/admin/settings/general',
                icon: SlidersHorizontal,
            },
            {
                title: 'Akun Pembayaran',
                href: '/admin/settings/payment-accounts',
                icon: Wallet,
            },
            {
                title: 'Manajemen Admin',
                href: '/admin/settings/admins',
                icon: UserCog,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
