/**
 * @file ContactInfo.tsx
 * @description Komponen untuk menampilkan informasi kontak seperti alamat, telepon, dan email.
 * @requires lucide-react - Untuk ikon.
 */

import { Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';

/**
 * @interface ContactInfoProps
 * @description Props untuk komponen ContactInfo.
 * @property {object} settings - Objek yang berisi pengaturan kontak.
 * @property {string} [settings.contact_address] - Alamat sekretariat.
 * @property {string} [settings.contact_phone] - Nomor telepon.
 * @property {string} [settings.contact_email] - Alamat email.
 */
interface ContactInfoProps {
    settings: {
        contact_address?: string;
        contact_phone?: string;
        contact_email?: string;
    };
}

/**
 * @description Komponen internal untuk menampilkan satu item informasi kontak dengan ikon.
 * @param {object} props - Props untuk komponen ContactInfoItem.
 * @param {React.ElementType} props.icon - Komponen ikon yang akan ditampilkan.
 * @param {string} props.title - Judul untuk item informasi.
 * @param {React.ReactNode} props.children - Konten atau detail dari informasi.
 * @returns {JSX.Element}
 */
const ContactInfoItem = ({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground">{children}</p>
        </div>
    </div>
);

const ContactInfo: React.FC<ContactInfoProps> = ({ settings }) => {
    return (
        <div className="space-y-8 p-6 sm:p-10 lg:col-span-2">
            <h2 className="text-3xl font-bold">Informasi Kontak</h2>
            <div className="space-y-6">
                <ContactInfoItem icon={MapPin} title="Alamat Sekretariat">
                    {settings?.contact_address || 'Alamat belum diatur.'}
                </ContactInfoItem>
                <ContactInfoItem icon={Phone} title="Nomor Telepon">
                    {settings?.contact_phone || 'Telepon belum diatur.'}
                </ContactInfoItem>
                <ContactInfoItem icon={Mail} title="Alamat Email">
                    {settings?.contact_email || 'Email belum diatur.'}
                </ContactInfoItem>
            </div>
        </div>
    );
};

export default ContactInfo;