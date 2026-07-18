import { Link } from "react-router-dom";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
                {/* Form */}
                <div className="p-10">
                    <h1 className="text-4xl font-bold">
                        Create Account
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Join LearnHub and start learning today.
                    </p>
                    <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="mt-2 w-full rounded-lg border p-3"
                            />
                        </div>

                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className="mt-2 w-full rounded-lg border p-3"
                            />
                        </div>
                        <div>
                            <label>Birth Date</label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-lg border p-3"
                            />
                        </div>
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="mt-2 w-full rounded-lg border p-3"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="mt-2 w-full rounded-lg border p-3"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="mt-2 w-full rounded-lg border p-3"
                            />
                        </div>
                        <button
                            className="md:col-span-2 mt-3 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-6 text-center">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold"
                        >
                            Login
                        </Link>
                    </p>
                </div>

                {/* Right */}
                <div className="hidden md:flex items-center justify-center bg-slate-900 text-white p-10">
                    <div className="max-w-sm text-center">
                        <h2 className="text-4xl font-bold">
                            Start your journey
                        </h2>
                        <p className="mt-4 text-slate-300">
                            Create an account to enroll in courses,
                            track your grades, and connect with your professors.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}