/**
 * @file ContactDetailsCard.tsx
 * @description Komponen kartu untuk menampilkan detail lengkap dari sebuah pesan kontak.
 *
 * @component ContactDetailsCard
 * @param {object} props - Properti komponen.
 * @param {object} props.contact - Objek data kontak yang akan ditampilkan.
 * @returns {JSX.Element} Komponen kartu detail kontak.
 */
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React from 'react';

interface Contact {
    name: string;
    email: string;
    status: 'Baru' | 'Sudah Dibaca';
    message: string;
}

interface ContactDetailsCardProps {
    contact: Contact;
}

const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({
    contact,
}) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{contact.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {contact.email}
                        </p>
                    </div>
                    <Badge
                        variant={
                            contact.status === 'Baru' ? 'info' : 'success'
                        }
                    >
                        {contact.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{contact.message}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ContactDetailsCard;
