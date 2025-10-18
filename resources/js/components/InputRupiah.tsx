import { Input } from '@/components/ui/input'; // Asumsi menggunakan Shadcn UI
import { useEffect, useState } from 'react';

export const InputRupiah = ({ value, onValueChange, ...props }) => {
    // State untuk menyimpan nilai yang diformat yang dilihat pengguna
    const [displayValue, setDisplayValue] = useState('');

    // Fungsi untuk memformat angka menjadi format ribuan Indonesia
    const formatRupiah = (number) => {
        if (isNaN(number) || number === null || number === '') return '';
        return new Intl.NumberFormat('id-ID').format(number);
    };

    // Efek ini berjalan ketika nilai awal (dari database) berubah
    useEffect(() => {
        setDisplayValue(formatRupiah(value));
    }, [value]);

    // Fungsi ini berjalan setiap kali pengguna mengetik
    const handleChange = (e) => {
        const inputValue = e.target.value;

        // 1. Hapus semua karakter non-angka (seperti titik, koma, 'Rp')
        const rawValue = inputValue.replace(/[^0-9]/g, '');

        // 2. Update tampilan dengan nilai yang sudah diformat
        setDisplayValue(formatRupiah(rawValue));

        // 3. Kirim nilai ANGKA MURNI kembali ke form utama
        if (onValueChange) {
            onValueChange(rawValue);
        }
    };

    return (
        <div className="relative">
            {/* Prefix "Rp" di dalam input */}
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
                Rp
            </span>
            {/* Input utama */}
            <Input
                type="text" // Gunakan type text agar bisa menampilkan titik
                inputMode="numeric" // Memberi tahu keyboard mobile untuk menampilkan angka
                value={displayValue}
                onChange={handleChange}
                className="pl-9" // Beri padding kiri agar teks tidak tumpang tindih dengan "Rp"
                {...props}
            />
        </div>
    );
};
