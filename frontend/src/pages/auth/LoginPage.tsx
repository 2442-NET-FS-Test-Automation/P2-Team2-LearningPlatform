import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../ctx/AuthCtx";

import { getDashboardRoute } from "../../lib/funcs";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const user = await login({ EmailOrUsername: emailOrUsername, Password: password });
            console.log(user);
            console.log(getDashboardRoute(user.role));
            navigate(getDashboardRoute(user.role));
        } catch (e) {
            console.log(e)
            setError("Invalid username/email or password.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="form-label">Username or Email</label>
                            <input
                                type="text"
                                placeholder="Enter username or email"
                                className="form-input"
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-input"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-primary w-full py-3">
                            {isSubmitting ? "Logging in…" : "Login"}
                        </button>
                        {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
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
