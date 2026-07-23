import { BookOpen, GraduationCap, Users } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: <BookOpen size={22} />,
            stat: "25+",
            title: "Quality Courses",
            text: "Browse carefully designed university-level courses.",
            tone: "blue" as const
        },
        {
            icon: <GraduationCap size={22} />,
            stat: "20+",
            title: "Expert Professors",
            text: "Learn from experienced faculty members.",
            tone: "amber" as const
        },
        {
            icon: <Users size={22} />,
            stat: "300+",
            title: "Student Community",
            text: "Grow alongside classmates and professors.",
            tone: "indigo" as const
        }
    ];

    return (
        <section className="section-light relative overflow-hidden py-24">
            <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5" aria-hidden="true" />

            <div className="container-page relative">
                <div className="text-center">
                    <span className="eyebrow-badge">Why choose us</span>
                    <h2 className="mt-5 text-4xl font-bold tracking-tight">
                        Why LearnHub?
                    </h2>
                </div>

                <div className="card-grid mt-14">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="card group transition-transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`rounded-xl p-3 ${feature.tone}-accent-chip`}>
                                    {feature.icon}
                                </div>
                                <span
                                    className={`text-4xl font-extrabold leading-none ${feature.tone}-accent-watermark`}
                                    aria-hidden="true"
                                >
                                    {feature.stat}
                                </span>
                            </div>

                            <h3 className="mt-5 text-xl font-semibold">
                                {feature.title}
                            </h3>

                            <p className="mt-3 text-muted">
                                {feature.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}