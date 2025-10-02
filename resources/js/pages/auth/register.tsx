import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
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
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import loginImage from '../../../assets/images/gambar_login.png'; // Menggunakan gambar yang sama

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register'); // Menggunakan URL manual
    };

    return (
        <>
            <Head title="Daftar Akun" />
            <div className="grid min-h-screen w-full lg:grid-cols-2">
                {/* Kolom Kiri: Visual & Branding (Sama seperti halaman Login) */}
                <div className="relative hidden items-end bg-gray-900 p-12 lg:flex">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${loginImage})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-green-900/30" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-6 text-white">
                        <AppLogo className="text-white" />
                        <blockquote className="text-2xl leading-relaxed italic">
                            “Setiap kebaikan yang Anda berikan adalah harapan
                            baru bagi mereka yang membutuhkan. Terima kasih
                            telah menjadi bagian dari perjalanan ini.”
                        </blockquote>
                    </div>
                </div>

                {/* Kolom Kanan: Form Register */}
                <div className="relative flex flex-col items-center justify-center p-6 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-3xl font-bold">
                                Buat Akun Baru
                            </h1>
                            <p className="text-muted-foreground">
                                Daftar sebagai Muzakki untuk memulai kebaikan
                                Anda.
                            </p>
                        </div>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Formulir Pendaftaran</CardTitle>
                                <CardDescription>
                                    Lengkapi detail di bawah ini untuk membuat
                                    akun Anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                autoComplete="name"
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="Masukkan nama lengkap Anda"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Alamat Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                autoComplete="username"
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="contoh@email.com"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                autoComplete="new-password"
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="Buat password Anda"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">
                                                Konfirmasi Password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={
                                                    data.password_confirmation
                                                }
                                                autoComplete="new-password"
                                                onChange={(e) =>
                                                    setData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="Ulangi password Anda"
                                            />
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Button
                                            className="w-full text-base font-bold"
                                            disabled={processing}
                                        >
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            {processing
                                                ? 'Memproses...'
                                                : 'Buat Akun'}
                                        </Button>
                                    </div>
                                </form>
                                <div className="mt-6 text-center text-sm text-muted-foreground">
                                    Sudah punya akun?{' '}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-primary hover:underline"
                                    >
                                        Login di sini
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-8 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
