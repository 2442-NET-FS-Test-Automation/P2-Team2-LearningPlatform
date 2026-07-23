import { Link } from "react-router-dom";
import { useAuth } from "../../ctx/AuthCtx";
import { BookOpen, TrendingUp, GraduationCap } from "lucide-react";

export default function Hero() {
    const { user } = useAuth();
    const stats = {
        students: 300,
        enrolled: 1200,
        completionRate: 95
    }

    return (
        <section className="section-light relative overflow-hidden">
            {/* Ambient background accents */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-400/10" aria-hidden="true" />

            <div className="container-page relative grid min-h-[92vh] grid-cols-1 items-center gap-16 py-24 lg:grid-cols-2 lg:gap-12 lg:py-0">
                {/* Left Section */}
                <div className="relative z-10 text-center lg:text-left">
                    {/* Blob that shows student count */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                        </span>
                        {stats.students}+ students learning right now
                    </span>

                    {/* Motto */}
                    <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                        Learn without
                        <br />
                        <span className="relative inline-block">
                            <span className="relative z-10 text-blue-600 dark:text-blue-400">
                                limits
                            </span>
                            <span className="absolute inset-x-0 bottom-1.5 -z-0 h-4 rounded-sm bg-amber-300/40 dark:bg-amber-400/10" />
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-lg text-lg text-muted lg:mx-0">
                        Explore university courses, learn from experienced professors,
                        and take the next step toward your future.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <Link to="/courses" className="btn-cta-primary">
                            Browse Courses
                        </Link>
                        {!user &&
                            <Link to="/register" className="btn-cta-outline">
                                Get Started
                            </Link>
                        }
                    </div>
                </div>

                {/* Right section: visual */}
                <div className="relative z-10 mx-auto w-full max-w-md">
                    <div className="hero-blob">
                        <div className="dot-grid absolute inset-0 text-white/25 dark:text-white/15" />
                        <GraduationCap
                            size={220}
                            strokeWidth={1}
                            className="absolute -bottom-8 -right-8 text-white/15"
                        />
                        <div className="absolute left-8 top-10 h-24 w-24 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm" />
                    </div>

                    {/* Floating card: course progress */}
                    <div className="floating-card animate-float-slow -left-6 top-8 w-56 sm:-left-10">
                        <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                            <BookOpen size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                                Programming
                            </p>
                            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                <div className="h-1.5 w-4/5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Floating card: community */}
                    <div className="floating-card animate-float-slower -bottom-6 -right-4 w-60 sm:-right-10">
                        <div className="flex -space-x-2">
                            <span className="h-8 w-8 rounded-full border-2 border-white bg-blue-500 text-center text-xs font-semibold leading-8 text-white dark:border-slate-800">
                                JM
                            </span>
                            <span className="h-8 w-8 rounded-full border-2 border-white bg-amber-500 text-center text-xs font-semibold leading-8 text-white dark:border-slate-800">
                                OM
                            </span>
                            <span className="h-8 w-8 rounded-full border-2 border-white bg-indigo-500 text-center text-xs font-semibold leading-8 text-white dark:border-slate-800">
                                +
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{stats.enrolled}+ enrolled</p>
                            <p className="text-xs text-muted">at this time</p>
                        </div>
                    </div>

                    {/* Badge: completion rate */}
                    <div className="floating-card animate-float-slow -right-2 -top-6 gap-2 px-3 py-2 sm:-right-6">
                        <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-semibold">{stats.completionRate}% completion</span>
                    </div>
                </div>
            </div>
        </section>
    );
}