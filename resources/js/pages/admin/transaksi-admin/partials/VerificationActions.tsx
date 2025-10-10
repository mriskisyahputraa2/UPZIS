import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check, X } from 'lucide-react';

export default function VerificationActions({ onApprove, onReject }) {
    return (
        <Card className="border-green-200 bg-green-50/50 shadow-lg">
            <CardHeader>
                <CardTitle>Ambil Tindakan</CardTitle>
                <CardDescription>
                    Pastikan bukti transfer sudah sesuai sebelum menyetujui
                    pembayaran ini.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="destructive" onClick={onReject}>
                    <X className="mr-2 h-4 w-4" /> Tolak
                </Button>
                <Button variant="default" onClick={onApprove}>
                    <Check className="mr-2 h-4 w-4" /> Setujui
                </Button>
            </CardContent>
        </Card>
    );
}
