import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="bg-slate-50">
            <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-8 text-center">
                <h1 className="text-6xl font-extrabold leading-tight">
                    Learn without
                    <span className="text-blue-600">
                        {" "}limits
                    </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-slate-600">
                    Explore university courses, learn from experienced professors,
                    and take the next step toward your future.
                </p>

                <div className="mt-10 flex gap-4">
                    <Link
                        to="/courses"
                        className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Browse Courses
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-md border px-6 py-3 hover:bg-slate-100"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    );
}