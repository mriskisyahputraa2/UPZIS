import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

/**
 * @typedef {object} ZakatInput
 * @property {string} pendapatanPokok
 * @property {string} pendapatanLain
 * @property {string} hutangCicilan
 */

/**
 * @typedef {object} ZakatResult
 * @property {number} pendapatan_bersih
 * @property {number} nisab
 * @property {boolean} wajib_zakat
 * @property {number} nominal_zakat
 */

/**
 * Custom hook untuk mengelola logika dan state kalkulator zakat.
 *
 * @param {Array<object>} jenisZakat - Daftar jenis zakat yang tersedia dari props.
 * @returns {{
 *  activeZakatId: string,
 *  handleTypeChange: (id: string) => void,
 *  inputs: ZakatInput,
 *  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof ZakatInput) => void,
 *  activeZakatDetails: object | undefined,
 *  isProfesi: boolean,
 *  isLoading: boolean,
 *  result: ZakatResult | null,
 *  bayarZakatUrl: string
 * }}
 */
export function useZakatCalculator(jenisZakat) {
    // Menemukan ID default untuk 'Zakat Profesi'
    const defaultZakat = jenisZakat.find((zakat) =>
        zakat.name.toLowerCase().includes('profesi'),
    );
    const defaultZakatId = defaultZakat
        ? defaultZakat.id.toString()
        : jenisZakat.length > 0
          ? jenisZakat[0].id.toString()
          : '';

    const [activeZakatId, setActiveZakatId] = useState(defaultZakatId);
    const [inputs, setInputs] = useState({
        pendapatanPokok: '',
        pendapatanLain: '',
        hutangCicilan: '',
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mencari detail zakat yang aktif menggunakan useMemo
    const activeZakatDetails = useMemo(() => {
        return jenisZakat.find(
            (zakat) => zakat.id.toString() === activeZakatId,
        );
    }, [activeZakatId, jenisZakat]);

    // Flag untuk menentukan apakah zakat profesi yang aktif
    const isProfesi =
        activeZakatDetails?.name.toLowerCase().includes('profesi') ?? false;

    // useEffect untuk melakukan kalkulasi saat input berubah
    useEffect(() => {
        // Jangan lakukan apa-apa jika tidak ada jenis zakat yang aktif
        if (!activeZakatId) return;

        // Reset hasil jika semua input kosong
        if (
            inputs.pendapatanPokok === '' &&
            inputs.pendapatanLain === '' &&
            inputs.hutangCicilan === ''
        ) {
            setResult(null);
            return;
        }

        // Debounce untuk menunda request saat pengguna mengetik
        const delayDebounceFn = setTimeout(() => {
            setIsLoading(true);
            axios
                .post('/kalkulator-zakat/hitung', {
                    jenis_zakat_id: activeZakatId,
                    pendapatan_pokok: Number(inputs.pendapatanPokok) || 0,
                    pendapatan_lain: Number(inputs.pendapatanLain) || 0,
                    hutang_cicilan: Number(inputs.hutangCicilan) || 0,
                })
                .then((response) => setResult(response.data))
                .catch(() => toast.error('Gagal menghitung. Coba lagi.'))
                .finally(() => setIsLoading(false));
        }, 700);

        return () => clearTimeout(delayDebounceFn);
    }, [inputs, activeZakatId]);

    /**
     * Menangani perubahan pada input form (hanya menerima angka).
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event input.
     * @param {keyof ZakatInput} field - Nama field yang akan diupdate.
     */
    const handleInputChange = (e, field) => {
        const value = e.target.value.replace(/\D/g, '');
        setInputs((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Menangani perubahan jenis zakat yang dipilih.
     * Mereset semua input dan hasil.
     * @param {string} id - ID jenis zakat yang baru.
     */
    const handleTypeChange = (id) => {
        if (!id) return;
        setActiveZakatId(id);
        setInputs({
            pendapatanPokok: '',
            pendapatanLain: '',
            hutangCicilan: '',
        });
        setResult(null);
    };

    // Membuat URL untuk tombol "Bayar Zakat"
    const bayarZakatUrl =
        result && result.wajib_zakat && result.nominal_zakat > 0
            ? `/donasi/zakat?amount=${Math.round(result.nominal_zakat)}`
            : '/donasi/zakat';

    return {
        activeZakatId,
        handleTypeChange,
        inputs,
        handleInputChange,
        activeZakatDetails,
        isProfesi,
        isLoading,
        result,
        bayarZakatUrl,
    };
}
