import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/publicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Loader, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Komponen kecil untuk menampilkan item info kontak
const ContactInfoItem = ({ icon: Icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground">{children}</p>
        </div>
    </div>
);

export default function ContactIndex() {
    const { props } = usePage();
    const { generalSettings, flash } = props as any;

    const { data, setData, post, processing, errors, wasSuccessful, reset } =
        useForm({
            name: '',
            email: '',
            message: '',
        });

    // State untuk cooldown visual setelah pengiriman berhasil
    const COOLDOWN_SECONDS = 60;
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(COOLDOWN_SECONDS);

    // useEffect untuk menangani pesan flash dari backend
    useEffect(() => {
        // Jika ada pesan sukses, tampilkan toast dan mulai cooldown
        if (flash?.success) {
            toast.success(flash.success as string);
            reset();
            setIsCooldown(true);
            setCooldownTime(COOLDOWN_SECONDS);
        }
        // Jika ada pesan error (termasuk dari throttle), tampilkan toast error
        if (flash?.error) {
            toast.error(flash.error as string);
        }
    }, [flash]); // Hanya perlu memantau perubahan pada objek flash

    // useEffect untuk menangani timer countdown
    useEffect(() => {
        if (!isCooldown) return;
        if (cooldownTime <= 0) {
            setIsCooldown(false);
            return;
        }
        const timer = setInterval(() => {
            setCooldownTime((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [isCooldown, cooldownTime]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mencegah submit ganda saat sedang proses atau cooldown
        if (processing || isCooldown) return;

        post('/kontak', {
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Hubungi Kami" />

            <section className="bg-green-700 pt-28 pb-16 text-white md:pt-32">
                <div className="container mx-auto max-w-4xl px-6 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Hubungi Kami
                    </h1>
                    <p className="mt-4 text-lg text-green-100">
                        Punya pertanyaan atau masukan? Kami siap mendengarkan.
                    </p>
                </div>
            </section>

            <section className="-mt-10 pb-12 md:pb-16">
                <div className="container mx-auto max-w-7xl px-4">
                    <Card className="overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-5">
                                <div className="space-y-8 p-6 sm:p-10 lg:col-span-2">
                                    <h2 className="text-3xl font-bold">
                                        Informasi Kontak
                                    </h2>
                                    <div className="space-y-6">
                                        <ContactInfoItem
                                            icon={MapPin}
                                            title="Alamat Sekretariat"
                                        >
                                            {generalSettings?.contact_address ||
                                                'Alamat belum diatur.'}
                                        </ContactInfoItem>
                                        <ContactInfoItem
                                            icon={Phone}
                                            title="Nomor Telepon"
                                        >
                                            {generalSettings?.contact_phone ||
                                                'Telepon belum diatur.'}
                                        </ContactInfoItem>
                                        <ContactInfoItem
                                            icon={Mail}
                                            title="Alamat Email"
                                        >
                                            {generalSettings?.contact_email ||
                                                'Email belum diatur.'}
                                        </ContactInfoItem>
                                    </div>
                                </div>
                                <div className="flex flex-col rounded-b-lg border-t p-6 sm:p-10 lg:col-span-3 lg:rounded-r-lg lg:rounded-bl-none lg:border-t-0 lg:border-l">
                                    <h2 className="text-3xl font-bold">
                                        Kirim Pesan
                                    </h2>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-6 flex flex-1 flex-col space-y-4"
                                    >
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Nama Lengkap *
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Nama Anda"
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Alamat Email *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="email@anda.com"
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col space-y-2">
                                            <Label htmlFor="message">
                                                Pesan Anda *
                                            </Label>
                                            <Textarea
                                                id="message"
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Tuliskan pesan Anda di sini..."
                                                className="flex-1"
                                            />
                                            {errors.message && (
                                                <p className="text-sm text-red-600">
                                                    {errors.message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            className="mt-auto w-full"
                                            size="lg"
                                            disabled={processing || isCooldown}
                                        >
                                            {processing ? (
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            ) : isCooldown ? (
                                                `Kirim lagi dalam ${cooldownTime} detik`
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Kirim Pesan
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section>
                <div className="container mx-auto max-w-7xl px-4 text-center">
                    <h2 className="mb-6 text-3xl font-bold">Lokasi Kami</h2>
                </div>
                <div className="h-[450px] w-full md:h-[550px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.3620580528486!2d97.15578601037409!3d5.1206249948350235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304777a35c813bbf%3A0xfac9e2831347f07f!2sPoliteknik%20Negeri%20Lhokseumawe!5e1!3m2!1sid!2sid!4v1761149656715!5m2!1sid!2sid"
                        className="h-full w-full border-0"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
        </PublicLayout>
    );
}
