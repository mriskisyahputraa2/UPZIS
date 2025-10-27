import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Tipe data untuk props paymentSettings
interface PaymentDetail {
    account: string;
    name: string;
    steps: string[];
}
interface PaymentSettingsProps {
    dana: PaymentDetail;
    gopay: PaymentDetail;
    tunai: PaymentDetail;
}

export default function PaymentAccountSettings({
    paymentSettings,
}: {
    paymentSettings: PaymentSettingsProps;
}) {
    const { flash } = usePage().props;

    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Pengaturan' },
        { title: 'Akun Pembayaran' },
    ];

    const { data, setData, patch, errors, processing } = useForm({
        dana: paymentSettings.dana || { account: '', name: '', steps: [''] },
        gopay: paymentSettings.gopay || { account: '', name: '', steps: [''] },
        tunai: paymentSettings.tunai || { account: '', name: '', steps: [''] },
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success as string);
        }
    }, [flash]);

    // Helper untuk mengelola array 'steps'
    const handleStepChange = (
        method: 'dana' | 'gopay' | 'tunai',
        index: number,
        value: string,
    ) => {
        const updatedSteps = [...data[method].steps];
        updatedSteps[index] = value;
        setData(method, { ...data[method], steps: updatedSteps });
    };

    const addStep = (method: 'dana' | 'gopay' | 'tunai') => {
        setData(method, {
            ...data[method],
            steps: [...data[method].steps, ''],
        });
    };

    const removeStep = (method: 'dana' | 'gopay' | 'tunai', index: number) => {
        const updatedSteps = data[method].steps.filter((_, i) => i !== index);
        setData(method, { ...data[method], steps: updatedSteps });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/settings/payment-accounts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Akun Pembayaran" />

            {/* --- PERUBAHAN DI SINI: Tambahkan padding responsif --- */}
            <div className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* --- KARTU DANA --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Akun DANA</CardTitle>
                            <CardDescription>
                                Atur detail akun dan instruksi pembayaran untuk
                                metode DANA.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="dana_account">
                                    Nomor Akun DANA
                                </Label>
                                <Input
                                    id="dana_account"
                                    value={data.dana.account}
                                    onChange={(e) =>
                                        setData('dana', {
                                            ...data.dana,
                                            account: e.target.value,
                                        })
                                    }
                                />
                                {errors['dana.account'] && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors['dana.account']}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dana_name">
                                    Nama Pemilik Akun
                                </Label>
                                <Input
                                    id="dana_name"
                                    value={data.dana.name}
                                    onChange={(e) =>
                                        setData('dana', {
                                            ...data.dana,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                {errors['dana.name'] && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors['dana.name']}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Langkah-langkah Instruksi</Label>
                                {data.dana.steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <Input
                                            value={step}
                                            onChange={(e) =>
                                                handleStepChange(
                                                    'dana',
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeStep('dana', index)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addStep('dana')}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Langkah
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- KARTU GOPAY (Struktur Sama) --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Akun GoPay</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gopay_account">
                                    Nomor Akun GoPay
                                </Label>
                                <Input
                                    id="gopay_account"
                                    value={data.gopay.account}
                                    onChange={(e) =>
                                        setData('gopay', {
                                            ...data.gopay,
                                            account: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gopay_name">
                                    Nama Pemilik Akun
                                </Label>
                                <Input
                                    id="gopay_name"
                                    value={data.gopay.name}
                                    onChange={(e) =>
                                        setData('gopay', {
                                            ...data.gopay,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Langkah-langkah Instruksi</Label>
                                {data.gopay.steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <Input
                                            value={step}
                                            onChange={(e) =>
                                                handleStepChange(
                                                    'gopay',
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeStep('gopay', index)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addStep('gopay')}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Langkah
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- KARTU TUNAI (Struktur Sama) --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pembayaran Tunai</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tunai_account">
                                    Nama Lokasi Setor (cth: Sekretariat UPZIS)
                                </Label>
                                <Input
                                    id="tunai_account"
                                    value={data.tunai.account}
                                    onChange={(e) =>
                                        setData('tunai', {
                                            ...data.tunai,
                                            account: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tunai_name">
                                    Detail Alamat Lokasi
                                </Label>
                                <Input
                                    id="tunai_name"
                                    value={data.tunai.name}
                                    onChange={(e) =>
                                        setData('tunai', {
                                            ...data.tunai,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Langkah-langkah Instruksi</Label>
                                {data.tunai.steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <Input
                                            value={step}
                                            onChange={(e) =>
                                                handleStepChange(
                                                    'tunai',
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeStep('tunai', index)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addStep('tunai')}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Langkah
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Semua Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
