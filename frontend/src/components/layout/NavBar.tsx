import { Link } from "react-router-dom"
import { useTheme } from "../../ctx/ThemeCtx";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="navbar">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                <Link to="/"
                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                > LearnHub </Link>

                <div className="flex items-center gap-8">
                    <Link to="/courses" className="nav-link" > Courses </Link>
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
        </header>
    );
}