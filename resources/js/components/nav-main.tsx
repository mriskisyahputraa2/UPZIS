// Impor komponen dan hook yang dibutuhkan
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    // State untuk melacak menu mana yang terbuka
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    // Fungsi untuk mengecek apakah ada sub-menu yang sedang aktif
    const isSubMenuActive = (subItems: NavItem['subItems']) => {
        return subItems?.some((item) => page.url.startsWith(item.href!));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    // Cek: Apakah item ini punya subItems?
                    item.subItems && item.subItems.length > 0 ? (
                        // JIKA IYA: Render sebagai menu dropdown (Collapsible)
                        <Collapsible
                            key={item.title}
                            open={
                                openMenu === item.title ||
                                isSubMenuActive(item.subItems)
                            }
                            onOpenChange={() =>
                                setOpenMenu(
                                    openMenu === item.title ? null : item.title,
                                )
                            }
                        >
                            <SidebarMenuItem
                                isActive={isSubMenuActive(item.subItems)}
                            >
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: item.title }}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight
                                            className={cn(
                                                'ml-auto h-4 w-4 shrink-0 transition-transform',
                                                (openMenu === item.title ||
                                                    isSubMenuActive(
                                                        item.subItems,
                                                    )) &&
                                                    'rotate-90',
                                            )}
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                            </SidebarMenuItem>

                            <CollapsibleContent>
                                <div className="pl-7">
                                    <SidebarMenu>
                                        {item.subItems.map((subItem) => (
                                            <SidebarMenuItem
                                                key={subItem.title}
                                                isActive={page.url.startsWith(
                                                    subItem.href,
                                                )}
                                            >
                                                <SidebarMenuButton
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={subItem.href!}
                                                        prefetch
                                                    >
                                                        {/* START: Tampilkan ikon sub-menu di sini */}
                                                        {subItem.icon && (
                                                            <subItem.icon className="mr-2 h-4 w-4 shrink-0" />
                                                        )}
                                                        {/* END: Perubahan */}
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ) : (
                        // JIKA TIDAK: Render sebagai link biasa
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(item.href!)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href!} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
