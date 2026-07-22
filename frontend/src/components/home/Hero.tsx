import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="section-light">
            <div className="mx-auto flex min-h-[95vh] max-w-7xl flex-col items-center justify-center px-8 text-center">
                <h1 className="text-6xl font-extrabold leading-tight">
                    Learn without
                    <span className="text-blue-600 dark:text-blue-400">
                        {" "}limits
                    </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-muted">
                    Explore university courses, learn from experienced professors,
                    and take the next step toward your future.
                </p>

                <div className="mt-10 flex gap-4">
                    <Link to="/courses" className="btn-cta-primary">
                        Browse Courses
                    </Link>
                    <Link to="/register" className="btn-cta-outline">
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    );
}