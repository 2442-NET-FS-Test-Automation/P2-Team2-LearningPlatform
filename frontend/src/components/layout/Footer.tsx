export default function Footer() {
    return (
        <footer className="border-t bg-slate-900 text-white dark:bg-black dark:border-slate-700">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <h2 className="text-2xl font-bold">
                    LearnHub
                </h2>

                <p className="mt-2 text-slate-300 max-w-lg dark:text-slate-400">
                    LearnHub is an online learning platform connecting
                    students with professors through engaging,
                    high-quality university courses.
                </p>

                <div className="mt-5 border-t border-slate-700 pt-6 text-sm text-slate-400 dark:border-slate-600 dark:text-slate-500">
                    © 2026 LearnHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}