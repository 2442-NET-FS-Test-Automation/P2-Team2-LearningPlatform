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
            <div className="container-page">
                <h2 className="mb-12 text-center text-4xl font-bold">
                    Why LearnHub?
                </h2>

                <div className="card-grid">
                    {features.map((feature) => (
                        <div key={feature.title} className="card">
                            <div className="text-blue-600 dark:text-blue-400">
                                {feature.icon}
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