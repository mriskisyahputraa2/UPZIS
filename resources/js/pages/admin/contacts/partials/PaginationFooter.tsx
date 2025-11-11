/**
 * @file PaginationFooter.tsx
 * @description Komponen footer untuk tabel yang menampilkan informasi paginasi dan kontrol navigasi.
 *
 * @component PaginationFooter
 * @param {object} props - Properti komponen.
 * @param {object} props.contacts - Objek paginasi data kontak dari Inertia.
 * @returns {JSX.Element | null} Komponen footer paginasi atau null jika tidak ada data.
 */
import {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import React from 'react';

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationFooterProps {
    contacts: {
        data: any[];
        from: number;
        to: number;
        total: number;
        links: Link[];
    };
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({ contacts }) => {
    if (contacts.data.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-between gap-4 pt-4 md:flex-row">
            <div className="text-sm text-muted-foreground">
                Menampilkan <strong>{contacts.from || 0}</strong> -{' '}
                <strong>{contacts.to || 0}</strong> dari{' '}
                <strong>{contacts.total || 0}</strong> hasil
            </div>
            <Pagination>
                <PaginationContent>
                    {contacts.links.map((link, index) =>
                        link.label.includes('Previous') ? (
                            <PaginationPrevious
                                key={index}
                                href={link.url || ''}
                                preserveScroll
                            />
                        ) : link.label.includes('Next') ? (
                            <PaginationNext
                                key={index}
                                href={link.url || ''}
                                preserveScroll
                            />
                        ) : (
                            <PaginationLink
                                key={index}
                                href={link.url || ''}
                                isActive={link.active}
                                preserveScroll
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ),
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationFooter;
