// resources/js/components/pagination.jsx

import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationComponent({ meta }) {
    return (
        <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-500">
                Menampilkan{' '}
                <span className="font-medium">{meta.from || 0}</span> -{' '}
                <span className="font-medium">{meta.to || 0}</span> dari{' '}
                <span className="font-medium">{meta.total || 0}</span> hasil
            </div>
            <div className="flex items-center gap-1">
                {meta.links.map((link, index) => {
                    const isFirst = index === 0;
                    const isLast = index === meta.links.length - 1;

                    if (!link.url) {
                        return (
                            <div
                                key={index}
                                className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border bg-gray-100 px-3 text-sm font-medium text-gray-400"
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={cn(
                                'flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition',
                                link.active
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'bg-white hover:bg-gray-50',
                                isFirst || isLast ? 'px-2' : '',
                            )}
                        >
                            {isFirst && <ChevronLeft className="h-4 w-4" />}
                            {!isFirst && !isLast && (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )}
                            {isLast && <ChevronRight className="h-4 w-4" />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
