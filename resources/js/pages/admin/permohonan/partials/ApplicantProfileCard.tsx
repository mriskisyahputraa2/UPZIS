import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Bookmark, Copy, PersonStanding, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

// Helper untuk inisial nama
const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export default function ApplicantProfileCard({ permohonan }) {
    const { mustahik } = permohonan;

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`"${label}" berhasil disalin!`);
    };

    return (
        <Card className="sticky top-24 overflow-hidden">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="h-48 w-full">
                    {mustahik.photo ? (
                        <img
                            src={`/storage/${mustahik.photo}`}
                            alt={mustahik.name}
                            className="h-full w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
                            <UserIcon className="h-24 w-24 text-muted-foreground/30" />
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{mustahik.name}</h2>
                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                        <UserIcon className="h-4 w-4" />
                        <span>Calon Mustahik</span>
                    </p>
                </div>

                <div className="w-full space-y-4 pt-4 text-left">
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Kode Pendaftaran
                        </Label>
                        <div className="mt-1 flex items-center justify-between rounded-md border bg-muted px-3 py-2">
                            <code className="font-mono text-sm font-semibold text-primary">
                                {permohonan.unique_code}
                            </code>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                    copyToClipboard(
                                        permohonan.unique_code,
                                        'Kode Pendaftaran',
                                    )
                                }
                            >
                                <Copy className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    {/* ## PERUBAHAN DI SINI: Tambahkan field Jenis Kelamin ## */}
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Jenis Kelamin
                        </Label>
                        <div className="mt-1 flex items-center gap-2 rounded-md border p-3">
                            <PersonStanding className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">
                                {mustahik.jenis_kelamin || '-'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">
                            Kategori Pemohon
                        </Label>
                        <div className="mt-1 flex items-center gap-2 rounded-md border p-3">
                            <Bookmark className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium capitalize">
                                {permohonan.kategori_pemohon === 'umum'
                                    ? 'Fakir/Miskin'
                                    : permohonan.kategori_pemohon}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
