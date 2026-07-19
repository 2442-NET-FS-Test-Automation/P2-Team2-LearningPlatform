import { Link } from "react-router-dom";

export default function LoginPage() {
    return (
        <div className="auth-shell">
            <div className="auth-card">
                {/* Left */}
                <div className="auth-form-panel">
                    <h1 className="text-4xl font-bold">
                        Welcome Back
                    </h1>
                    <p className="mt-3 text-muted">
                        Sign in to continue using LearnHub.
                    </p>
                    <form className="mt-8 space-y-5">
                        <div>
                            <label className="form-label">Username or Email</label>
                            <input
                                type="text"
                                placeholder="Enter username or email"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-input"
                            />
                        </div>
                        <button className="btn-primary w-full py-3">
                            Login
                        </button>
                    </form>
                    <p className="mt-6 text-center dark:text-slate-300">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-semibold dark:text-blue-400">
                            Register
                        </Link>
                    </p>
                </div>

                {/* Right */}
                <div className="auth-side-panel">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold">
                            LearnHub
                        </h2>
                        <p className="mt-4 text-muted-alt">
                            Learn, grow and connect with professors
                            from anywhere.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}