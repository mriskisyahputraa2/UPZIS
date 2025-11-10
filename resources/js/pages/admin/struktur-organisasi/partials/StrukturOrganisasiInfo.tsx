import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function StrukturOrganisasiInfo() {
    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader className="flex-row items-center gap-2 space-y-0 text-blue-600">
                    <Info className="h-5 w-5" />
                    <CardTitle>Informasi Halaman</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mt-2 space-y-4 text-sm text-muted-foreground">
                        <p>
                            <strong>Gambar Struktur</strong> adalah bagan atau
                            foto resmi yang akan ditampilkan di halaman publik
                            "Tentang Kami".
                        </p>
                        <p>
                            Mengunggah gambar baru akan secara otomatis
                            menggantikan gambar yang lama.
                        </p>
                        <p>
                            <strong>Keterangan</strong> bersifat opsional, namun
                            dapat digunakan untuk menjelaskan detail bagan,
                            seperti nama-nama pengurus.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
