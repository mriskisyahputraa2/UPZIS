import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useForm, usePage } from '@inertiajs/react';
import { Loader, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export default function UpdateProfileInformationForm({ className = '' }) {
    const { user } = usePage().props.auth;
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, errors, processing, isDirty, reset } = useForm(
        {
            name: user.name,
            photo: null,
        },
    );

    useEffect(() => {
        if (data.photo) {
            const newUrl = URL.createObjectURL(data.photo);
            setPreviewUrl(newUrl);
            return () => URL.revokeObjectURL(newUrl);
        }
    }, [data.photo]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!isDirty) return;

        post('/profile', {
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                reset('photo');
                setPreviewUrl(null);
            },
            onError: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <Card className={className}>
            <form onSubmit={submit}>
                <CardHeader>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>
                        Perbarui nama dan foto profil Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <div className="flex flex-col items-center space-y-3">
                        <button
                            type="button"
                            className="group relative rounded-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={processing}
                        >
                            <Avatar className="h-24 w-24 border-2 border-muted">
                                <AvatarImage
                                    src={previewUrl || user.photo_url}
                                    alt={user.name}
                                />
                                <AvatarFallback className="bg-green-200 text-3xl font-bold text-green-800">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                {processing ? (
                                    <Loader className="h-6 w-6 animate-spin text-white" />
                                ) : (
                                    <User className="h-8 w-8 text-white/80" />
                                )}
                            </div>
                        </button>
                        <div className="text-center">
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={processing}
                            >
                                Ubah Foto Profil
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                JPG, atau PNG. Maks 2MB.
                            </p>
                            {errors.photo && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.photo}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user.email}
                            readOnly
                            className="cursor-not-allowed bg-muted/50"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={processing || !isDirty}>
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
