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
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { HandCoins, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import PenyaluranForm from './PenyaluranForm';
import PenyaluranItem from './PenyaluranItem';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

export default function DistributionHistoryCard({ permohonan }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [toEdit, setToEdit] = useState(null);
    const [toDelete, setToDelete] = useState(null);

    const handleDelete = () => {
        if (!toDelete) return;
        router.delete(`/admin/penyaluran/${toDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setToDelete(null),
        });
    };

    const totalDisalurkan = permohonan.penyalurans.reduce(
        (sum, p) => sum + parseFloat(p.amount),
        0,
    );

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Riwayat Penyaluran Dana</CardTitle>
                        <CardDescription>
                            Daftar bantuan yang telah diberikan.
                        </CardDescription>
                    </div>
                    {permohonan.status === 'Disetujui' && (
                        <Dialog
                            open={isCreateOpen}
                            onOpenChange={setIsCreateOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Catat Penyaluran
                                </Button>
                            </DialogTrigger>
                            <PenyaluranForm
                                permohonan={permohonan}
                                onOpenChange={setIsCreateOpen}
                            />
                        </Dialog>
                    )}
                </CardHeader>
                <CardContent>
                    {permohonan.penyalurans.length > 0 ? (
                        <ul className="divide-y">
                            {permohonan.penyalurans.map((p) => (
                                <PenyaluranItem
                                    key={p.id}
                                    penyaluran={p}
                                    onEdit={setToEdit}
                                    onDelete={setToDelete}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center">
                            <HandCoins className="mx-auto h-12 w-12 text-muted-foreground/30" />
                            <p className="mt-4 text-muted-foreground">
                                Belum ada data penyaluran yang dicatat.
                            </p>
                        </div>
                    )}
                </CardContent>
                {totalDisalurkan > 0 && (
                    <CardFooter className="flex justify-between bg-muted/50 p-4 font-bold">
                        <span>Total Disalurkan</span>
                        <span className="text-green-600">
                            {formatCurrency(totalDisalurkan)}
                        </span>
                    </CardFooter>
                )}
            </Card>

            <Dialog open={!!toEdit} onOpenChange={() => setToEdit(null)}>
                {toEdit && (
                    <PenyaluranForm
                        permohonan={permohonan}
                        penyaluran={toEdit}
                        onOpenChange={() => setToEdit(null)}
                        onSuccess={() => setToEdit(null)}
                    />
                )}
            </Dialog>

            <AlertDialog
                open={!!toDelete}
                onOpenChange={() => setToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus catatan penyaluran sebesar{' '}
                            <strong>{formatCurrency(toDelete?.amount)}</strong>{' '}
                            ini?
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
        </>
    );
}
