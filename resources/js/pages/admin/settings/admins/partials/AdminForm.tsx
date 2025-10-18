import InputError from '@/components/input-error';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// isEdit adalah prop untuk mengubah teks di form (Edit vs Tambah)
export function AdminForm({ data, setData, errors, isEdit = false }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detail Admin</CardTitle>
                <CardDescription>
                    Isi semua informasi yang diperlukan untuk akun admin.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Masukkan nama lengkap admin"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="admin@contoh.com"
                    />
                    <InputError message={errors.email} />
                </div>

                {isEdit && (
                    <>
                        <hr />
                        <p className="text-sm text-muted-foreground">
                            Isi kolom password hanya jika Anda ingin
                            mengubahnya.
                        </p>
                    </>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">
                        {isEdit ? 'Password Baru' : 'Password *'}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                        {isEdit
                            ? 'Konfirmasi Password Baru'
                            : 'Konfirmasi Password *'}
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
