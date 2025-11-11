/**
 * @file UploadProofForm.tsx
 * @description Komponen form untuk mengunggah bukti pembayaran.
 *
 * @component UploadProofForm
 * @param {object} props - Properti komponen.
 * @param {string} props.orderId - ID order dari transaksi.
 * @param {object} props.form - Objek form dari `useForm` Inertia.
 * @returns {JSX.Element} Komponen form unggah bukti.
 */
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface UploadProofFormProps {
    orderId: string;
    form: {
        data: { payment_proof: File | null };
        setData: (key: 'payment_proof', value: File | null) => void;
        post: (url: string, options?: any) => void;
        processing: boolean;
        errors: { payment_proof?: string };
    };
}

const UploadProofForm: React.FC<UploadProofFormProps> = ({
    orderId,
    form,
}) => {
    const { data, setData, post, processing, errors } = form;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (data.payment_proof) {
            const newUrl = URL.createObjectURL(data.payment_proof);
            setPreviewUrl(newUrl);
            return () => URL.revokeObjectURL(newUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [data.payment_proof]);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('payment_proof', e.target.files[0]);
        } else {
            setData('payment_proof', null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/transaksi/${orderId}/upload`, {
            onSuccess: () => setData('payment_proof', null),
        });
    };

    return (
        <Card className="shadow-lg duration-500 animate-in fade-in">
            <CardHeader>
                <CardTitle>Upload Bukti Pembayaran</CardTitle>
                <CardDescription>
                    Setelah membayar, unggah bukti transfer Anda di sini untuk
                    verifikasi.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={processing}
                    />
                    {previewUrl && (
                        <div className="space-y-2">
                            <Label>Preview Bukti Pembayaran</Label>
                            <div className="relative w-full max-w-xs rounded-lg border p-2">
                                <img
                                    src={previewUrl}
                                    alt="Preview Bukti Pembayaran"
                                    className="h-auto w-full rounded-md object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => setData('payment_proof', null)}
                                    className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/75"
                                    aria-label="Hapus gambar"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            {data.payment_proof && (
                                <p
                                    className="truncate text-sm text-muted-foreground"
                                    title={data.payment_proof.name}
                                >
                                    {data.payment_proof.name}
                                </p>
                            )}
                        </div>
                    )}
                    {errors.payment_proof && (
                        <p className="text-sm text-red-600">
                            {errors.payment_proof}
                        </p>
                    )}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={handleFileSelect}
                            disabled={processing}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {previewUrl ? 'Ganti File' : 'Pilih File Bukti'}
                        </Button>
                        <Button
                            type="submit"
                            className="w-full font-bold sm:flex-1"
                            disabled={!data.payment_proof || processing}
                        >
                            {processing
                                ? 'Mengunggah...'
                                : 'Kirim Bukti Pembayaran'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default UploadProofForm;
