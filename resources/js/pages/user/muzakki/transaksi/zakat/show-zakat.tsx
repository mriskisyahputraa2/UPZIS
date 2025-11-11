import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/publicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader } from 'lucide-react';
import PageHeader from '../partials/PageHeader';
import PaymentInstructions from './partials/PaymentInstructions';
import StatusAlerts from './partials/StatusAlerts';
import TransactionSummary from './partials/TransactionSummary';
import UploadProofForm from './partials/UploadProofForm';

// Tipe data untuk transaksi dan detail pembayaran
interface PaymentDetails {
    account: string;
    name: string;
    steps: string[];
}

interface Transaksi {
    order_id: string;
    status: string;
    type: 'zakat' | 'infaq' | 'sedekah';
    formatted_date: string;
    formatted_time: string;
    payment_method: string;
    final_amount: number;
}

interface ShowZakatProps {
    transaksi: Transaksi;
    paymentDetails: PaymentDetails | null;
}

// Helper untuk mendapatkan nama donasi yang diformat
const getDonationTypeName = (type: string) => {
    if (!type || type === 'zakat') return 'Zakat';
    return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ShowZakat({ transaksi, paymentDetails }: ShowZakatProps) {
    const form = useForm({
        payment_proof: null as File | null,
    });

    // Tampilkan loading jika data transaksi belum ada
    if (!transaksi) {
        return (
            <PublicLayout>
                <Head title="Memuat Transaksi..." />
                <div className="flex min-h-screen items-center justify-center">
                    <Loader className="h-8 w-8 animate-spin" />
                </div>
            </PublicLayout>
        );
    }

    const donationTypeName = getDonationTypeName(transaksi.type);

    return (
        <PublicLayout>
            <Head title={`Detail Transaksi ${transaksi.order_id}`} />

            <PageHeader
                title="Detail Transaksi"
                description="Selesaikan pembayaran Anda dan lihat statusnya di sini."
            />

            <section className="-mt-16 pb-16 md:pb-24">
                <div className="container mx-auto max-w-2xl space-y-6 px-6">
                    {/* Komponen untuk ringkasan utama transaksi */}
                    <TransactionSummary transaksi={transaksi} />

                    {/* Tampilkan komponen ini hanya jika status 'Menunggu Pembayaran' */}
                    {transaksi.status === 'Menunggu Pembayaran' && (
                        <>
                            <PaymentInstructions
                                method={transaksi.payment_method}
                                details={paymentDetails}
                            />
                            <UploadProofForm
                                orderId={transaksi.order_id}
                                form={form}
                            />
                        </>
                    )}

                    {/* Komponen untuk menampilkan alert berdasarkan status */}
                    <StatusAlerts
                        status={transaksi.status}
                        donationTypeName={donationTypeName}
                    />

                    <div className="text-center">
                        <Link href="/profile">
                            <Button variant="ghost">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Riwayat Transaksi
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
