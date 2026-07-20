export default function FeaturedCourses() {
    // TODO: Actually have data
    const courses = [
        "Algorithms",
        "Database Systems",
        "Operating Systems"
    ];

    return (
        <section className="section-light py-20">
            <div className="container-page">
                <h2 className="mb-10 text-4xl font-bold">
                    Featured Courses
                </h2>

                <div className="card-grid">
                    {courses.map(course => (
                        <div key={course} className="card">
                            <h3 className="text-xl font-semibold">
                                {course}
                            </h3>

                            <p className="mt-3 text-muted">
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