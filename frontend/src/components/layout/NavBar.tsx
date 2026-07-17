import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <header className="shadow-sm border-b bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                <Link to="/"
                    className="text-2xl font-bold text-blue-600"
                > LearnHub </Link>

                <div className="flex items-center gap-8">

                    <Link to="/courses"
                        className="font-medium hover:text-blue-600"
                    > Courses </Link>

                    <Link to="/login"
                        className="font-medium hover:text-blue-600"
                    > Login </Link>

                    <Link to="/register"
                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    > Register </Link>
                </div>
            </nav>
        </header>
    );
}