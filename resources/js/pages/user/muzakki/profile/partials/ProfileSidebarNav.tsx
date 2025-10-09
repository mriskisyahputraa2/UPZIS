import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreditCard, Lock, User } from 'lucide-react';

const navLinks = [
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'password', label: 'Ubah Password', icon: Lock },
    { id: 'history', label: 'Riwayat Transaksi', icon: CreditCard },
];

export default function ProfileSidebarNav({ active, setActive }) {
    return (
        <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
                <Button
                    key={link.id}
                    variant="ghost"
                    onClick={() => setActive(link.id)}
                    className={cn(
                        'w-full justify-start px-4 py-6 text-base',
                        active === link.id
                            ? 'bg-muted font-bold text-primary hover:bg-muted'
                            : 'hover:bg-muted/50',
                    )}
                >
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.label}
                </Button>
            ))}
        </nav>
    );
}
