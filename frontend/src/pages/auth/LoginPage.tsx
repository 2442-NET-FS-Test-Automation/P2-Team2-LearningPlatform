import { useEffect, useState, } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../ctx/AuthCtx";

import { getDashboardRoute } from "../../lib/funcs";

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            setError("Password should be at least 8 characters long");
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            const user = await login({ EmailOrUsername: emailOrUsername, Password: password });
            navigate(getDashboardRoute(user.role));
        } catch (e: unknown) {
            try {
                if (axios.isAxiosError(e)) {
                switch (e.response?.status) {
                    case 401:
                        setError("Invalid username/email or password.");
                        break;

                    case 403:
                        setError("User was deactivated.");
                        break;

                    default:
                        setError("Something went wrong. Try again later.");
                }
            } else {
                setError("API is down. Try again later.");
            }
            } catch { setError("API is down. Try again later."); }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        if (user) {
            navigate(getDashboardRoute(user.role));
        }
    }, [user, navigate]);

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
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="form-input pr-12"
                                    value = {password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button> 
                            </div>                          
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
