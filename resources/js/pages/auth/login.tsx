// resources/js/Pages/Auth/Login.jsx (Desain Sederhana + Perbaikan Final)

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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useEffect } from 'react';
import loginImage from '../../../assets/images/logo-icon.png';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="grid min-h-screen w-full lg:grid-cols-2">
                {/* Kolom Kiri: Visual & Branding */}
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

                {/* Kolom Kanan: Form Login */}
                <div className="relative flex flex-col items-center justify-center p-6 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className="mb-8 text-center lg:text-left">
                            <div className="mb-8 flex justify-center lg:hidden">
                                <AppLogo />
                            </div>
                            <h1 className="text-3xl font-bold">
                                Selamat Datang
                            </h1>
                            <p className="text-muted-foreground">
                                Login untuk melanjutkan kebaikan Anda.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Login Akun Anda</CardTitle>
                                <CardDescription>
                                    Masukkan email dan password yang telah
                                    terdaftar.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                autoComplete="username"
                                                autoFocus
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <Link
                                                        href="/forgot-password"
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        Lupa password?
                                                    </Link>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                autoComplete="current-password"
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onCheckedChange={(checked) =>
                                                    setData('remember', checked)
                                                }
                                            />
                                            <Label
                                                htmlFor="remember"
                                                className="cursor-pointer text-sm font-normal"
                                            >
                                                Ingat saya
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Button
                                            className="w-full text-base font-bold"
                                            disabled={processing}
                                        >
                                            <LogIn className="mr-2 h-4 w-4" />
                                            {processing
                                                ? 'Memproses...'
                                                : 'Login'}
                                        </Button>
                                    </div>
                                </form>
                                <div className="mt-6 text-center text-sm text-muted-foreground">
                                    Belum punya akun Muzakki?{' '}
                                    <Link
                                        href="/register"
                                        className="font-semibold text-primary hover:underline"
                                    >
                                        Daftar di sini
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
