import { useEffect, useState } from "react";
import { BookOpen, Users, FileText, Clock, Trophy } from "lucide-react";
import type { ProfessorSummary } from "../../../lib/types";
import { getProfessorSummary } from "../../../api/professorRequests";
import { Link } from "react-router-dom";

export default function SummarySection() {
    const [summary, setSummary] = useState<ProfessorSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProfessorSummary()
            .then(res => setSummary(res))
            .catch(() => setError("Failed to load summary data."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-slate-500">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !summary) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                <p>{error || "Could not load summary."}</p>
            </div>
        );
    }

    const metrics = [
        { title: "Total Courses", value: summary.totalCourses, icon: <BookOpen size={24} className="text-blue-500" />, bg: "bg-blue-100 dark:bg-blue-900/30" },
        { title: "Students Enrolled", value: summary.totalStudents, icon: <Users size={24} className="text-emerald-500" />, bg: "bg-emerald-100 dark:bg-emerald-900/30" },
        { title: "Active Activities", value: summary.totalActivities, icon: <FileText size={24} className="text-purple-500" />, bg: "bg-purple-100 dark:bg-purple-900/30" },
        { title: "Pending Grading", value: summary.pendingSubmissionsToGrade, icon: <Clock size={24} className="text-orange-500" />, bg: "bg-orange-100 dark:bg-orange-900/30" }
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => (
                    <div key={i} className="flex items-center card gap-4 rounded-xl p-6 transition-transform hover:-translate-y-1">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${metric.bg}`}>
                            {metric.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.title}</p>
                            <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metric.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-900/20">
                    <Trophy className="text-yellow-500" size={20} />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Courses by Enrollments</h3>
                </div>
                
                {summary.topCourses.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <p>No courses have students enrolled yet.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {summary.topCourses.map((course, index) => (
                            <li key={course.courseId} className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <Link to={"/courses/"+course.courseId}>
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400">{course.name}</h4>
                                        </Link>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{course.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{course.enrolledStudentsCount}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Students</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
