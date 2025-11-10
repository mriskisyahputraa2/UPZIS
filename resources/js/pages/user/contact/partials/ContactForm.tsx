/**
 * @file ContactForm.tsx
 * @description Komponen formulir kontak untuk mengirim pesan.
 * Mengelola state formulir, validasi, pengiriman, dan cooldown untuk mencegah spam.
 * @requires @inertiajs/react - Untuk manajemen form dan routing.
 * @requires sonner - Untuk menampilkan notifikasi (toast).
 * @requires lucide-react - Untuk ikon.
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Loader, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * @interface ContactFormProps
 * @description Props untuk komponen ContactForm.
 * @property {object} [flash] - Objek flash message dari Inertia.
 * @property {string} [flash.success] - Pesan sukses.
 * @property {string} [flash.error] - Pesan error.
 */
interface ContactFormProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

const ContactForm: React.FC<ContactFormProps> = ({ flash }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    // Durasi cooldown dalam detik setelah pengiriman berhasil
    const COOLDOWN_SECONDS = 60;
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(COOLDOWN_SECONDS);

    // Efek untuk menangani notifikasi toast berdasarkan flash message dari server
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            reset(); // Reset form setelah berhasil
            setIsCooldown(true); // Aktifkan cooldown
            setCooldownTime(COOLDOWN_SECONDS);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash, reset]);

    // Efek untuk mengelola timer countdown
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

    /**
     * @description Menangani pengiriman formulir.
     * Mencegah pengiriman ganda jika sedang dalam proses atau masa cooldown.
     * @param {React.FormEvent} e - Event formulir.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing || isCooldown) return;

        post('/kontak', {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex flex-col rounded-b-lg border-t p-6 sm:p-10 lg:col-span-3 lg:rounded-r-lg lg:rounded-bl-none lg:border-t-0 lg:border-l">
            <h2 className="text-3xl font-bold">Kirim Pesan</h2>
            <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-1 flex-col space-y-4"
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama Anda"
                            disabled={processing || isCooldown}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Alamat Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@anda.com"
                            disabled={processing || isCooldown}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-1 flex-col space-y-2">
                    <Label htmlFor="message">Pesan Anda *</Label>
                    <Textarea
                        id="message"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder="Tuliskan pesan Anda di sini..."
                        className="flex-1"
                        disabled={processing || isCooldown}
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
    );
};

export default ContactForm;
