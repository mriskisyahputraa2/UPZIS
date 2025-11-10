import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { formatCurrency, itemVariants } from '../helpers';

const ProgramCard = ({ program }) => (
    <motion.div variants={itemVariants} className="h-full">
        <Link
            href={`/galeri/${program.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl bg-white text-left shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
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
                        {format(
                            new Date(program.program_date),
                            'dd MMMM yyyy',
                            { locale: id },
                        )}
                    </p>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
                <h3 className="line-clamp-2 h-14 text-xl font-bold text-gray-800 transition-colors group-hover:text-green-700">
                    {program.name}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {program.description}
                </p>
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-slate-500">Dana Tersalurkan</p>
                    <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(program.penyalurans_sum_amount)}
                    </p>
                </div>
            </div>
        </Link>
    </motion.div>
);

export default ProgramCard;
