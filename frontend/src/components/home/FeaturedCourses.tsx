export default function FeaturedCourses() {
    // TODO: Actually have data
    const courses = [
        "Algorithms",
        "Database Systems",
        "Operating Systems"
    ];

    return (
        <section className="section-light py-20">
            <div className="mx-auto max-w-7xl px-8">
                <h2 className="mb-10 text-4xl font-bold dark:text-white">
                    Featured Courses
                </h2>

                <div className="grid gap-8 md:grid-cols-3">
                    {courses.map(course => (
                        <div key={course} className="card">
                            <h3 className="text-xl font-semibold dark:text-white">
                                {course}
                            </h3>

                            <p className="mt-3 text-slate-600 dark:text-slate-300">
                                Discover the fundamentals and build practical
                                skills through hands-on learning.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}