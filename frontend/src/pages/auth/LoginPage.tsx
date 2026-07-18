import { Link } from "react-router-dom";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
                {/* Left */}
                <div className="p-10">
                    <h1 className="text-4xl font-bold">
                        Welcome Back
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Sign in to continue using LearnHub.
                    </p>
                    <form className="mt-8 space-y-5">
                        <div>
                            <label className="block mb-2 font-medium">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                placeholder="Enter username or email"
                                className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Login
                        </button>
                    </form>
                    <p className="mt-6 text-center">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 font-semibold"
                        >
                            Register
                        </Link>
                    </p>
                </div>

                {/* Right */}
                <div className="hidden md:flex bg-blue-600 text-white items-center justify-center p-10">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold">
                            LearnHub
                        </h2>
                        <p className="mt-4 text-blue-100">
                            Learn, grow and connect with professors
                            from anywhere.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}