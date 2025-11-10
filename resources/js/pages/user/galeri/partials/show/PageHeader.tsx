export default function PageHeader({ title }) {
    return (
        <section className="bg-green-700 pt-28 pb-24 text-white md:pt-32">
            <div className="container mx-auto max-w-4xl px-6 text-center">
                <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
            </div>
        </section>
    );
}
