import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function Pagination({ links = [] }) {


    return (
        <nav className="flex items-center justify-center border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex flex-wrap items-center gap-1">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        className={cn(
                            'flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors',
                            link.active
                                ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
                            !link.url
                                ? 'cursor-not-allowed text-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                                : 'border-gray-200 dark:border-gray-700'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </nav>
    );
}
