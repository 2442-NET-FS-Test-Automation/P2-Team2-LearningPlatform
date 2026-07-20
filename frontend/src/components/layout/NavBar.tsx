import { Link } from "react-router-dom"
import { useTheme } from "../../ctx/ThemeCtx";
import { Moon, Sun } from "lucide-react";
import { getDashboardRoute } from "../../lib/funcs";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="navbar">
            <nav className="flex container-page items-center justify-between py-4">
                <Link to="/"
                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                > LearnHub </Link>

                <div className="flex items-center gap-8">
                    <Link to="/courses" className="nav-link" > Courses </Link>

                    {/* Make a ternary once we have user auth */}
                    <Link to={getDashboardRoute("Student")} className="nav-link"> Dashboard </Link>
                    <Link to="/login" className="nav-link"> Login </Link>
                    <Link to="/register" className="btn-primary"> Register </Link>
                    
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