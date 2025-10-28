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
import { type NavItem } from '@/types';
// BARU: Import usePage untuk mendapatkan data user
import { usePage } from '@inertiajs/react';
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

// Definisikan semua kemungkinan item menu di sini
// Ganti array mainNavItems Anda dengan yang ini
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Operasional',
        icon: Wallet, // Ikon yang merepresentasikan aktivitas utama
        subItems: [
            {
                title: 'Verifikasi Transaksi',
                href: '/admin/transaksi',
                icon: ClipboardList,
            },
            {
                title: 'Permohonan Bantuan',
                href: '/admin/permohonan',
                icon: FileText,
            },
            {
                title: 'Penyaluran Bantuan',
                href: '/admin/laporan-penyaluran',
                icon: HandCoins,
            },
        ],
    },
    {
        title: 'Publikasi & Konten',
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
        title: 'Manajemen Data',
        icon: BookType, // Ikon untuk data referensi
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

// BARU: Definisikan rute yang diizinkan untuk role 'admin'
const adminAllowedRoutes = [
    '/admin/dashboard',
    '/admin/mustahiks',
    '/admin/transaksi',
    '/admin/laporan-penyaluran',
    '/admin/permohonan',
    '/admin/programs',
    '/admin/kontak',
];

export function AppSidebar() {
    // BARU: Dapatkan data user dari props halaman
    const { auth } = usePage().props as any;
    const userRole = auth.user.role;

    // BARU: Logika untuk memfilter item menu berdasarkan role
    const visibleNavItems =
        userRole === 'superadmin'
            ? mainNavItems // Super Admin melihat semua menu
            : mainNavItems.reduce((acc, item) => {
                  // Jika item tidak punya sub-menu
                  if (!item.subItems) {
                      if (adminAllowedRoutes.includes(item.href)) {
                          acc.push(item);
                      }
                      return acc;
                  }

                  // Jika item punya sub-menu, filter sub-menunya
                  const allowedSubItems = item.subItems.filter((subItem) =>
                      adminAllowedRoutes.includes(subItem.href),
                  );

                  // Jika ada sub-menu yang diizinkan, tampilkan menu utamanya
                  if (allowedSubItems.length > 0) {
                      acc.push({ ...item, subItems: allowedSubItems });
                  }

                  return acc;
              }, [] as NavItem[]);

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
                {/* DIUBAH: Gunakan array menu yang sudah difilter */}
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
