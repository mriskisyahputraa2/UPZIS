import {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import ProgramCard from './ProgramCard';

export default function ProgramGrid({ programs }) {
    return (
        <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {programs.data.map((program) => (
                    <ProgramCard
                        key={program.id}
                        program={program}
                    />
                ))}
            </div>
            <div className="mt-16 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        {programs.links.map((link, index) =>
                            link.label.includes('Previous') ? (
                                <PaginationPrevious
                                    key={index}
                                    href={link.url}
                                />
                            ) : link.label.includes('Next') ? (
                                <PaginationNext
                                    key={index}
                                    href={link.url}
                                />
                            ) : (
                                <PaginationLink
                                    key={index}
                                    href={link.url}
                                    isActive={link.active}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}
