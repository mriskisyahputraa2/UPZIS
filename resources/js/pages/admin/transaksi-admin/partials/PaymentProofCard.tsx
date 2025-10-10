import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, ZoomIn } from 'lucide-react';

export default function PaymentProofCard({ transaksi }) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Bukti Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
                {transaksi.payment_proof_url ? (
                    <div className="group relative overflow-hidden rounded-lg border">
                        <img
                            src={transaksi.payment_proof_url}
                            alt={`Bukti pembayaran untuk ${transaksi.order_id}`}
                            className="h-auto max-h-[80vh] w-full object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <a
                                href={transaksi.payment_proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline" size="lg">
                                    <ZoomIn className="mr-2 h-5 w-5" /> Lihat
                                    Ukuran Penuh
                                </Button>
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-lg border bg-muted/30 p-4 text-center">
                        <Info className="mb-4 h-10 w-10 text-muted-foreground" />
                        <p className="text-lg font-semibold">
                            {transaksi.payment_method === 'Tunai'
                                ? 'Pembayaran Dilakukan Secara Tunai'
                                : 'Tidak Ada Bukti Pembayaran'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {transaksi.payment_method === 'Tunai'
                                ? 'Verifikasi dilakukan langsung oleh admin di lokasi.'
                                : 'Pengguna belum mengunggah bukti pembayaran.'}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
