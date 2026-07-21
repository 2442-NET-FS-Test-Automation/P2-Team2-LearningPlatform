import { Link, useNavigate } from "react-router-dom"
import { Moon, Sun, LogOut } from "lucide-react";

import { useTheme } from "../../ctx/ThemeCtx";
import { useAuth } from "../../ctx/AuthCtx";

import { getDashboardRoute } from "../../lib/funcs";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="navbar">
            <nav className="flex container-page items-center justify-between py-4">
                <Link to="/"
                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                > LearnHub </Link>

                <div className="flex items-center gap-8">
                    <Link to="/courses" className="nav-link" > Courses </Link>

                    {user ? (
                        <>
                            <Link to={getDashboardRoute("Student")} className="nav-link"> Dashboard </Link>
                            <button onClick={handleLogout} className="nav-link flex items-center gap-1.5">
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to = "/login" className = "nav-link"> Login </Link>
                            <Link to="/register" className="btn-primary"> Register </Link>
                        </>
                    )}
                    
                    
                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-500"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>

            {/* TODO: Make a hamburger style menu for mobile */}
        </header>
    );
}