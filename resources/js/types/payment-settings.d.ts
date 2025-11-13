/**
 * @file resources/js/types/payment-settings.d.ts
 * @description Definisi tipe data untuk fitur pengaturan akun pembayaran.
 */

// Tipe untuk detail satu metode pembayaran
export interface PaymentDetail {
    account: string;
    name: string;
    steps: string[];
}

// Tipe untuk keseluruhan form pengaturan pembayaran
export interface PaymentSettingsForm {
    dana: PaymentDetail;
    gopay: PaymentDetail;
    tunai: PaymentDetail;
}
