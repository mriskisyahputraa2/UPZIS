import { CardFooter } from '@/components/ui/card';
import {
    Pagination as UIPagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginatedPrograms } from '@/types/program';

/**
 * @interface PaginationProps
 * @description Properti untuk komponen Pagination.
 */
interface PaginationProps {
    links: PaginatedPrograms['links'];
    from: number;
    to: number;
    total: number;
    show: boolean;
}

/**
 * @name Pagination
 * @description Komponen untuk menampilkan navigasi paginasi dan informasi jumlah data.
 * @returns {JSX.Element | null}
 */
const Pagination = ({ links, from, to, total, show }: PaginationProps) => {
    if (!show) {
        return null;
    }

    return (
        <CardFooter className="flex flex-col items-center justify-between gap-4 pt-4 md:flex-row">
            <div className="text-sm text-muted-foreground">
                Menampilkan <strong>{from || 0}</strong> -{' '}
                <strong>{to || 0}</strong> dari <strong>{total || 0}</strong>{' '}
                hasil
            </div>
            <UIPagination>
                <PaginationContent>
                    {links.map((link, index) =>
                        link.label.includes('Previous') ? (
                            <PaginationPrevious
                                key={index}
                                href={link.url!}
                                preserveScroll
                            />
                        ) : link.label.includes('Next') ? (
                            <PaginationNext
                                key={index}
                                href={link.url!}
                                preserveScroll
                            />
                        ) : (
                            <PaginationLink
                                key={index}
                                href={link.url!}
                                isActive={link.active}
                                preserveScroll
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ),
                    )}
                </PaginationContent>
            </UIPagination>
        </CardFooter>
    );
};

export default Pagination;
