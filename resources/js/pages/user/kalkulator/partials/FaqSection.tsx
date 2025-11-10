import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';
import { faqs } from '../kalkulator-helpers';

/**
 * Komponen untuk menampilkan bagian Pertanyaan Umum (FAQ) dalam bentuk akordion.
 *
 * @returns {JSX.Element}
 */
const FaqSection = () => {
    return (
        <section className="pb-24">
            <div className="container mx-auto max-w-4xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Pertanyaan Umum
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                        Jawaban cepat untuk pertanyaan paling umum seputar
                        perhitungan zakat.
                    </p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index + 1}`}
                        >
                            <AccordionTrigger className="text-left text-lg font-semibold text-green-800 hover:no-underline">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-slate-600">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FaqSection;
