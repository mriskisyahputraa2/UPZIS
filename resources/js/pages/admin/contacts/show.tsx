import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import ContactDetailsCard from './partials/ContactDetailsCard';
import DeleteContactDialog from './partials/DeleteContactDialog';
import ShowPageHeader from './partials/ShowPageHeader';

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Pesan Masuk', href: '/admin/kontak' },
    { title: 'Detail Pesan' },
];

export default function Show({ contact }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        router.delete(`/admin/kontak/${contact.id}`, {
            onSuccess: () => setIsDeleting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pesan dari ${contact.name}`} />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <ShowPageHeader formattedDate={contact.formatted_date} />

                <ContactDetailsCard contact={contact} />

                <div className="flex justify-end gap-4 pt-6">
                    <Link href="/admin/kontak" preserveState={false}>
                        <Button type="button" variant="outline">
                            Kembali
                        </Button>
                    </Link>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setIsDeleting(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </Button>
                </div>
            </div>

            <DeleteContactDialog
                isOpen={isDeleting}
                onOpenChange={setIsDeleting}
                onConfirm={handleDelete}
                contact={contact}
            />
        </AppLayout>
    );
}
