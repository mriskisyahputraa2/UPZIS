import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

export default function UpdatePasswordForm({ className = '' }) {
    const { data, setData, put, errors, processing, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Card className={className}>
            <form onSubmit={submit}>
                <CardHeader>
                    <CardTitle>Ubah Password</CardTitle>
                    <CardDescription>
                        Pastikan Anda menggunakan password yang aman dan mudah
                        diingat.
                    </CardDescription>
                </CardHeader>
                {/* =============================================================== */}
                {/* PERBAIKAN FINAL: Gunakan layout vertikal sederhana */}
                {/* =============================================================== */}
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">
                            Password Saat Ini
                        </Label>
                        <Input
                            id="current_password"
                            type="password"
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            autoComplete="current-password"
                        />
                        {errors.current_password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.current_password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password Baru</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">
                            Konfirmasi Password Baru
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            autoComplete="new-password"
                        />
                    </div>
                </CardContent>
                {/* <Separator /> */}
                <CardFooter className="justify-end p-6">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Ubah Password'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
