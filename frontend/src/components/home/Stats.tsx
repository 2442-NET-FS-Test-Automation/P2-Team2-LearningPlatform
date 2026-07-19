export default function Stats() {
    // TODO: But this are to show off
    const stats = [
        { value: "25+", label: "Courses" },
        { value: "300+", label: "Students" },
        { value: "20+", label: "Professors" },
        { value: "95%", label: "Completion Rate" },
    ];

    return (
        <section className="section-white py-20 dark:bg-slate-800/80">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <h2 className="big-stat">
                            {stat.value}
                        </h2>

                        <p className="mt-2 text-muted">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}