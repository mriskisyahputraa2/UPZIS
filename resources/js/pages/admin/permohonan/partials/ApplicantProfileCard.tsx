import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Copy, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplicantProfileCard({ permohonan }) {
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`"${label}" berhasil disalin!`);
    };

    return (
        <Card className="sticky top-24 overflow-hidden text-center">
            <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="h-48 w-full">
                    {permohonan.mustahik.photo ? (
                        <img
                            src={`/storage/${permohonan.mustahik.photo}`}
                            alt={permohonan.mustahik.name}
                            className="h-full w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
                            <UserIcon className="h-24 w-24 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">
                        {permohonan.mustahik.name}
                    </h2>
                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                        <UserIcon className="h-4 w-4" />
                        <span>Calon Mustahik</span>
                    </p>
                </div>
                <div className="w-full pt-4 text-left">
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
            </CardContent>
        </Card>
    );
}
