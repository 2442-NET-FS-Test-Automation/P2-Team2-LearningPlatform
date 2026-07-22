import { useState } from "react";
import { Link } from "react-router-dom"
import { Moon, Sun, Menu, X } from "lucide-react";

import { useTheme } from "../../ctx/ThemeCtx";
import { useAuth } from "../../ctx/AuthCtx";

import { getDashboardRoute } from "../../lib/funcs";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="navbar">
            <nav className="flex container-page items-center justify-between py-4">
                <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    LearnHub
                </Link>

                {/* Desktop controls */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link to="/courses" className="nav-link" > Courses </Link>

                    {user ? (
                        <Link to={getDashboardRoute(user.role)} className="nav-link"> Dashboard </Link>
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

                {/* Mobile controls */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-500"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-500"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown panel */}
            {isMenuOpen && (
                <div className="border-t border-slate-200 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
                    <div className="flex flex-col gap-4">
                        <Link to="/courses" onClick={closeMenu} className="nav-link">Courses</Link>
                        {user ? (
                            <Link to={getDashboardRoute(user.role)} onClick={closeMenu} className="nav-link">Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="nav-link">Login</Link>
                                <Link to="/register" onClick={closeMenu} className="btn-primary text-center">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}