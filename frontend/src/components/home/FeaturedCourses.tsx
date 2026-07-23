import { Link } from "react-router-dom";
import { Cpu, Database, Server, ArrowRight } from "lucide-react";

export default function FeaturedCourses() {
    // TODO: Actually have data
    const courses = [
        {
            id: 1,
            title: "Algorithms",
            icon: <Cpu size={22} />,
            tone: "blue" as const,
            text: "Discover the fundamentals and build practical skills through hands-on learning."
        },
        {
            id: 1,
            title: "Database Systems",
            icon: <Database size={22} />,
            tone: "amber" as const,
            text: "Discover the fundamentals and build practical skills through hands-on learning."
        },
        {
            id: 1,
            title: "Operating Systems",
            icon: <Server size={22} />,
            tone: "indigo" as const,
            text: "Discover the fundamentals and build practical skills through hands-on learning."
        }
    ];

    return (
        <section className="section-white py-12 pb-30 dark:bg-slate-900">
            <div className="container-page">
                <div className="text-center">
                    <span className="eyebrow-badge">Popular this term</span>
                    <h2 className="mt-5 text-4xl font-bold tracking-tight">
                        Featured Courses
                    </h2>
                </div>

                <div className="card-grid mt-14">
                    {courses.map((course) => (
                        <div
                            key={course.title}
                            className="card group flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`rounded-xl p-3 ${course.tone}-accent-chip`}>
                                    {course.icon}
                                </div>
                            </div>

                            <h3 className="mt-5 text-xl font-semibold">
                                {course.title}
                            </h3>

                            <p className="mt-3 flex-1 text-muted">
                                {course.text}
                            </p>

                            <Link
                                to={"/courses/"+course.id}
                                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                View course
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}