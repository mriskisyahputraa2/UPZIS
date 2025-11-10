import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function ProgramCard({ program }) {
    return (
        <Link
            href={`/galeri/${program.id}`}
            className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={
                        program.photos.length > 0
                            ? `/storage/${program.photos[0].photo_path}`
                            : 'https://via.placeholder.com/600x338?text=Dokumentasi+Program'
                    }
                    alt={program.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute right-4 bottom-4 left-4 text-white">
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <CalendarDays className="h-4 w-4" />
                        {format(new Date(program.program_date), 'dd MMMM yyyy', {
                            locale: id,
                        })}
                    </p>
                </div>
            </div>
            <div className="p-6">
                <h3 className="line-clamp-2 h-14 text-xl font-bold text-gray-800 transition-colors group-hover:text-green-700">
                    {program.name}
                </h3>
                <p className="mt-2 line-clamp-3 h-[60px] text-sm leading-relaxed text-gray-600">
                    {program.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Dana Tersalurkan
                        </p>
                        <p className="text-xl font-bold text-green-700">
                            {formatCurrency(program.penyalurans_sum_amount)}
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-green-600 group-hover:text-white">
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
