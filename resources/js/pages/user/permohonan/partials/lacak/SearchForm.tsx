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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, Search } from 'lucide-react';
import React from 'react';

/**
 * @typedef {object} SearchFormProps
 * @property {string} activeTab - Tab yang sedang aktif ('kodeUnik' atau 'dataDiri').
 * @property {(tab: string) => void} setActiveTab - Fungsi untuk mengubah tab aktif.
 * @property {object} data - Objek data dari hook useForm.
 * @property {(field: string, value: any) => void} setData - Fungsi untuk mengubah data form.
 * @property {(e: React.FormEvent<HTMLFormElement>) => void} handleSearch - Fungsi untuk menangani submit pencarian.
 * @property {boolean} processing - Status apakah pencarian sedang diproses.
 * @property {object} errors - Objek error dari hook useForm.
 */

/**
 * Komponen formulir pencarian untuk melacak permohonan.
 * Memiliki dua tab: pencarian dengan kode unik dan dengan data diri (NIK/No. HP).
 *
 * @param {SearchFormProps} props - Properti untuk komponen.
 * @returns {JSX.Element}
 */
const SearchForm = ({
    activeTab,
    setActiveTab,
    data,
    setData,
    handleSearch,
    processing,
    errors,
}) => {
    return (
        <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
        >
            <TabsList className="grid h-12 w-full grid-cols-2">
                <TabsTrigger value="kodeUnik" className="text-base">
                    Dengan Kode Unik
                </TabsTrigger>
                <TabsTrigger value="dataDiri" className="text-base">
                    Dengan Data Diri
                </TabsTrigger>
            </TabsList>

            <TabsContent value="kodeUnik">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Masukkan Kode Pendaftaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col items-start gap-4 sm:flex-row"
                        >
                            <div className="w-full space-y-2">
                                <Label htmlFor="kode" className="sr-only">
                                    Kode Unik
                                </Label>
                                <Input
                                    id="kode"
                                    value={data.kode}
                                    onChange={(e) =>
                                        setData('kode', e.target.value)
                                    }
                                    placeholder="Contoh: UPZ-17590..."
                                    className="h-12 text-lg"
                                />
                                <InputError message={errors.kode} />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                                className="h-12 w-full text-base font-bold sm:w-auto"
                            >
                                {processing ? (
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="mr-2 h-4 w-4" />
                                )}
                                Lacak
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="dataDiri">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Masukkan Data Diri Anda</CardTitle>
                        <CardDescription>
                            Anda bisa menggunakan NIK atau Nomor Handphone yang
                            terdaftar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col items-start gap-4 sm:flex-row"
                        >
                            <div className="w-full space-y-2">
                                <Label
                                    htmlFor="identifier"
                                    className="sr-only"
                                >
                                    NIK atau No. HP
                                </Label>
                                <Input
                                    id="identifier"
                                    value={data.identifier}
                                    onChange={(e) =>
                                        setData('identifier', e.target.value)
                                    }
                                    placeholder="Masukkan NIK atau No. HP Anda..."
                                    className="h-12 text-lg"
                                />
                                <InputError message={errors.identifier} />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                                className="h-12 w-full text-base font-bold sm:w-auto"
                            >
                                {processing ? (
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="mr-2 h-4 w-4" />
                                )}
                                Lacak
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default SearchForm;
