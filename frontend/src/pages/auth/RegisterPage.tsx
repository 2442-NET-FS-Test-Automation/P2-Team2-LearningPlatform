import { Link } from "react-router-dom";

export default function RegisterPage() {
    return (
        <div className="auth-shell">
            <div className="auth-card">
                {/* Form */}
                <div className="auth-form-panel">
                    <h1 className="text-4xl font-bold">
                        Create Account
                    </h1>
                    <p className="mt-3 text-muted">
                        Join LearnHub and start learning today.
                    </p>
                    <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">Birth Date</label>
                            <input
                                type="date"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="form-input"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-input"
                            />
                        </div>
                        <button className="btn-primary md:col-span-2 mt-3 w-full py-3 font-semibold">
                            Create Account
                        </button>
                    </form>

                    <p className="mt-6 text-center dark:text-slate-300">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold dark:text-blue-400"
                        >
                            Login
                        </Link>
                    </p>
                </div>

                {/* Right */}
                <div className="auth-side-panel">
                    <div className="max-w-sm text-center">
                        <h2 className="text-4xl font-bold">
                            Start your journey
                        </h2>
                        <p className="mt-4 text-muted-alt">
                            Create an account to enroll in courses,
                            track your grades, and connect with your professors.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}