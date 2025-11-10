/**
 * Memformat angka menjadi format mata uang Rupiah (IDR).
 * @param {number | string} value - Nilai numerik yang akan diformat.
 * @returns {string} String yang telah diformat sebagai mata uang.
 */
export const formatCurrency = (value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(numericValue);
};

/**
 * Daftar pertanyaan yang sering diajukan (FAQ) seputar zakat.
 */
export const faqs = [
    {
        q: 'Mengapa nisab zakat diukur dengan emas?',
        a: 'Nisab zakat maal dianalogikan (qiyas) dengan 85 gram emas murni karena emas memiliki nilai yang stabil dan diterima secara universal sebagai standar kekayaan dari zaman Rasulullah SAW hingga sekarang.',
    },
    {
        q: 'Apakah hutang cicilan bisa menjadi pengurang zakat profesi?',
        a: 'Ulama kontemporer umumnya berpendapat bahwa hutang yang dapat menjadi pengurang adalah hutang jatuh tempo yang harus dibayarkan saat itu juga dan mengurangi kebutuhan pokok. Cicilan rutin (KPR, kendaraan) umumnya tidak termasuk pengurang.',
    },
    {
        q: 'Bagaimana jika penghasilan saya tidak menentu setiap bulan?',
        a: 'Jika penghasilan tidak menentu, Anda bisa mengakumulasikannya selama satu tahun. Jika total pendapatan bersih selama satu tahun melebihi nisab tahunan (85 gram emas), maka Anda wajib mengeluarkan zakat sebesar 2.5% dari total pendapatan tersebut.',
    },
];
