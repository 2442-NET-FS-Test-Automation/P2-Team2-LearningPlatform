import { getGradeColor } from "../../lib/funcs";
import type { UserStats } from "../../lib/types";

export default function ProgressSection({
    TotalCourses,
    Completed,
    AvgGrade,
}: UserStats) {
    return (
        <div className="card space-y-6">
            <h2 className="text-xl font-semibold dark:text-white">Your Progress</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{TotalCourses}</p>
                    <p className="text-sm text-muted">Enrolled</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{Completed}</p>
                    <p className="text-sm text-muted">Completed</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                    <p className={`text-3xl font-bold ${getGradeColor(AvgGrade)}`}>{AvgGrade}%</p>
                    <p className="text-sm text-muted">Average Grade</p>
                </div>
            </div>
        </div>
    );
}