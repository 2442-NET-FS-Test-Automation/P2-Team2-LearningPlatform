import { BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import { getGradeColor } from "../../../lib/funcs";
import type { StudentStats } from "../../../lib/types";

export default function ProgressSection({
    TotalCourses,
    Completed,
    AvgGrade,
}: StudentStats) {
    return (
        <div className="card space-y-6 transition-shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="stat-card space-y-2">
                    <div className="blue-accent-chip mx-auto flex h-10 w-10 items-center justify-center rounded-full">
                        <BookOpen size={18} />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{TotalCourses}</p>
                    <p className="text-sm text-muted">Enrolled</p>
                </div>

                <div className="stat-card space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                        <CheckCircle2 size={18} />
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{Completed}</p>
                    <p className="text-sm text-muted">Completed</p>
                </div>
                <div className="stat-card space-y-2">
                    <div className="amber-accent-chip mx-auto flex h-10 w-10 items-center justify-center rounded-full">
                        <TrendingUp size={18} />
                    </div>
                    <p className={`text-3xl font-bold ${getGradeColor(AvgGrade)}`}>{Math.trunc(AvgGrade)}%</p>
                    <p className="text-sm text-muted">Average Grade</p>
                </div>

            </div>
        </div>
    );
}