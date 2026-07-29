import { useEffect, useState } from "react";
import { BookOpen, Users, ClipboardList, Trophy } from "lucide-react";

import type { AdminReport } from "../../../lib/types";
import { getGeneralReport } from "../../../api/reportsRequests";
import Loading from "../../../components/layout/Loading";
import { Link } from "react-router-dom";

export default function ManagerReportsSection() {
    const [report, setReport] = useState<AdminReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadReport();
    }, []);

    async function loadReport() {
        setLoading(true);
        setError(null);

        try {
            const data = await getGeneralReport();
            setReport(data);
        } catch {
            setError("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (<Loading fullh={false} message="Loading report data..." />);

    if (error || !report) {
        return (
            <div className="card space-y-6">
                <h2 className="text-2xl font-bold">Reports</h2>
                <p className="text-red-500">{error || "No report data available."}</p>
                <button className="btn-outline text-sm" onClick={loadReport}>
                    Try again
                </button>
            </div>
        );
    }

    // Find the max enrollment to calculate bar widths
    const maxEnrollment = report.topCourses.length > 0
        ? Math.max(...report.topCourses.map(c => c.enrollmentCount))
        : 1;

    return (
        <>
            <div className="card space-y-6 transition-shadow hover:shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold">Reports</h2>
                    <button className="btn-outline flex items-center gap-2 text-sm" onClick={loadReport}>
                        Refresh
                    </button>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="stat-card space-y-2">
                        <div className="blue-accent-chip mx-auto flex h-10 w-10 items-center justify-center rounded-full">
                            <BookOpen size={20} />
                        </div>
                        <p className="big-stat">{report.totalCourses}</p>
                        <p className="text-sm text-muted">Total Courses</p>
                    </div>
                    <div className="stat-card space-y-2">
                        <div className="amber-accent-chip mx-auto flex h-10 w-10 items-center justify-center rounded-full">
                            <Users size={20} />
                        </div>
                        <p className="big-stat">{report.totalStudents}</p>
                        <p className="text-sm text-muted">Total Students</p>
                    </div>
                    <div className="stat-card space-y-2">
                        <div className="indigo-accent-chip mx-auto flex h-10 w-10 items-center justify-center rounded-full">
                            <ClipboardList size={20} />
                        </div>
                        <p className="big-stat">{report.totalEnrollments}</p>
                        <p className="text-sm text-muted">Total Enrollments</p>
                    </div>
                </div>
            </div>

            {/* Top Courses */}
            <div className="card space-y-6 mt-6 transition-shadow hover:shadow-lg">
                <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-amber-500" />
                    <h3 className="text-xl font-bold">Top Courses by Enrollment</h3>
                </div>

                {report.topCourses.length === 0 ? (
                    <p className="text-muted">No enrollment data yet.</p>
                ) : (
                    <div className="space-y-4">
                        {report.topCourses.map((course, index) => {
                            const percentage = maxEnrollment > 0
                                ? (course.enrollmentCount / maxEnrollment) * 100
                                : 0;

                            return (
                                <div key={course.courseId} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">
                                            {index + 1}. {course.courseName}
                                        </span>
                                        <span className="text-muted">
                                            {course.enrollmentCount} enrolled
                                        </span>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Summary table */}
                {report.topCourses.length > 0 && (
                    <div className="overflow-x-auto border-t border-slate-200 pt-4 dark:border-slate-700">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-slate-500 dark:text-slate-400">
                                    <th className="py-3">Rank</th>
                                    <th>Course</th>
                                    <th className="text-right">Enrollments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.topCourses.map((course, index) => (
                                    <tr
                                        key={course.courseId}
                                        className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="py-3">
                                            <span className="blue-accent-chip rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="font-medium"><Link to={"/courses/"+course.courseId}>{course.courseName}</Link></td>
                                        <td className="text-right">{course.enrollmentCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}