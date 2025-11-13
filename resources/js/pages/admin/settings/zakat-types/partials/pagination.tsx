import { CardFooter } from '@/components/ui/card';
import {
    Pagination as UIPagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginatedZakatTypes } from '@/types/zakat-type';

/**
 * @interface PaginationProps
 * @description Properti untuk komponen Pagination.
 * @property {PaginatedZakatTypes} data - Objek data paginasi dari Inertia.
 */
interface PaginationProps {
    data: PaginatedZakatTypes;
}

/**
 * @name Pagination
 * @description Komponen untuk menampilkan navigasi paginasi dan informasi jumlah data.
 * @param {PaginationProps} props - Properti komponen.
 * @returns {JSX.Element | null}
 */
const Pagination = ({ data }: PaginationProps) => {
    if (data.data.length === 0) {
        return null;
    }

    return (
        <CardFooter className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-muted-foreground">
                Menampilkan{' '}
                <span className="font-semibold">{data.from || 0}</span> -{' '}
                <span className="font-semibold">{data.to || 0}</span> dari{' '}
                <span className="font-semibold">{data.total || 0}</span> hasil
            </div>
            <UIPagination>
                <PaginationContent>
                    {data.links.map((link, index) =>
                        link.label.includes('Previous') ? (
                            <PaginationPrevious
                                key={index}
                                href={link.url!}
                                preserveScroll
                                preserveState
                            />
                        ) : link.label.includes('Next') ? (
                            <PaginationNext
                                key={index}
                                href={link.url!}
                                preserveScroll
                                preserveState
                            />
                        ) : (
                            <PaginationLink
                                key={index}
                                href={link.url!}
                                isActive={link.active}
                                preserveScroll
                                preserveState
                            >
                                {link.label}
                            </PaginationLink>
                        ),
                    )}
                </PaginationContent>
            </UIPagination>
        </CardFooter>
    );
};

export default Pagination;
