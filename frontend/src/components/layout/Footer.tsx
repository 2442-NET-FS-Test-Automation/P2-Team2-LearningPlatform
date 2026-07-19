export default function Footer() {
    return (
        <footer className="border-t bg-slate-900 text-white dark:bg-black dark:border-slate-700">
            <div className="container-page py-10">
                <h2 className="text-2xl font-bold">
                    LearnHub
                </h2>

                <p className="text-muted-alt mt-2 max-w-lg">
                    LearnHub is an online learning platform connecting
                    students with professors through engaging,
                    high-quality university courses.
                </p>

                <div className="text-muted-alt text-sm mt-5 border-t border-slate-700 pt-6">
                    © 2026 LearnHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}