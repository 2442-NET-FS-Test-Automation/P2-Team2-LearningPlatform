import { BookOpen, GraduationCap, Users } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: <BookOpen size={34} />,
            title: "Quality Courses",
            text: "Browse carefully designed university-level courses."
        },
        {
            icon: <GraduationCap size={34} />,
            title: "Expert Professors",
            text: "Learn from experienced faculty members."
        },
        {
            icon: <Users size={34} />,
            title: "Student Community",
            text: "Grow alongside classmates and professors."
        }
    ];

    return (
        <section className="section-light py-20">
            <div className="mx-auto max-w-7xl px-8">
                <h2 className="mb-12 text-center text-4xl font-bold dark:text-white">
                    Why LearnHub?
                </h2>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="card">
                            <div className="text-blue-600">
                                {feature.icon}
                            </div>

                            <h3 className="mt-5 text-xl font-semibold dark:text-white">
                                {feature.title}
                            </h3>

                            <p className="mt-3 text-slate-600 dark:text-slate-300">
                                {feature.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}