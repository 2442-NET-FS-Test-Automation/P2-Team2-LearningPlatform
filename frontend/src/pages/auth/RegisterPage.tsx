import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../ctx/AuthCtx";

import { getDashboardRoute, isAlphanumeric } from "../../lib/funcs";
import type { RegisterData } from "../../lib/typesAuth";

const emptyForm: RegisterData = {
    FirstName: "",
    LastName: "",
    Username: "",
    Email: "",
    Password: "",
    BirthDate: "",
};

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterData>(emptyForm);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!isAlphanumeric(form.Username)) {
            setError("Username can only contain letters and numbers");
            setIsSubmitting(false);
            return;
        }
        
        const birthDateMs: number = Date.parse(form.BirthDate);
        const minDate: Date = new Date();
        minDate.setFullYear(minDate.getFullYear() - 12);

        if (birthDateMs > minDate.getTime()) {
            setError("You have to be 12 years old to register");
            setIsSubmitting(false);
            return;
        }

        if (form.Password.length < 8) {
            setError("Your password should be at least 8 characters long");
            setIsSubmitting(false);
            return;
        }

        try {
            const user = await register(form);
            
            navigate(getDashboardRoute(user.role));
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not create account. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="form-input"
                                onChange={updateField("FirstName")}
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className="form-input"
                                onChange={updateField("LastName")}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Birth Date</label>
                            <input
                                type="date"
                                className="form-input"
                                onChange={updateField("BirthDate")}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="form-input"
                                onChange={updateField("Username")}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                                onChange={updateField("Email")}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-input"
                                onChange={updateField("Password")}
                                required
                            />
                        </div>
                        {error && (
                            <p className="md:col-span-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}
                        <button className="btn-primary md:col-span-2 mt-3 w-full py-3 font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account…" : "Create Account"}
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
