import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'; // Import CardFooter
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';

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

            {/* ## PERUBAHAN 1: Hapus pb-24 dan md:pb-8 karena tidak perlu lagi padding bawah ekstra ## */}
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/kontak" preserveState={false}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">
                                Detail Pesan Masuk
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Pesan diterima pada {contact.formatted_date} WIB
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{contact.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {contact.email}
                                </p>
                            </div>
                            <Badge
                                variant={
                                    contact.status === 'Baru'
                                        ? 'info'
                                        : 'secondary'
                                }
                            >
                                {contact.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="whitespace-pre-wrap">
                                {contact.message}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-6">
                    <Link href="/admin/kontak" preserveState={false}>
                        <Button type="button" variant="outline">
                            Batal
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

            {/* ## PERUBAHAN 4: Hapus floating button sebelumnya ## */}
            {/* <div className="block md:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full shadow-lg"
                    onClick={() => setIsDeleting(true)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </Button>
                <Link href="/admin/kontak" preserveState={false}>
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full rounded-full shadow-lg"
                    >
                        Batal
                    </Button>
                </Link>
            </div> */}

            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pesan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda yakin ingin menghapus pesan ini secara
                            permanen?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
