/**
 * @file resources/js/types/settings.d.ts
 * @description Definisi tipe data untuk fitur pengaturan.
 */

// Tipe untuk data form yang digunakan oleh useForm hook
export interface SettingsForm {
    harga_emas_per_gram: string;
    contact_address: string;
    contact_phone: string;
    contact_email: string;
    alokasi_fakir_miskin_persen: string;
}
