import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

import Loading from "../../../components/layout/Loading";

import type { CourseSelectDto } from "../../../lib/types";
import ErrorMessage from "../../../components/ErrorMessage";

interface Props {
    courses: CourseSelectDto[];
    loading: boolean;
    error: string | null;
}

export default function AssignedCoursesSection({ courses, loading, error }: Props) {
    return (
        <div className="card space-y-6 transition-shadow hover:shadow-lg">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
                <BookOpen size={22} className="text-blue-600 dark:text-blue-400" />
                My Courses
            </h2>

            {error && <ErrorMessage error={error} />}

            {loading ? (
                <Loading fullh={false} message="Loading courses..." />
            ) : courses.length === 0 ? (
                <p className="text-muted">You have no assigned courses.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-slate-500 dark:text-slate-400">
                                <th className="py-3">Course</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr
                                    key={course.id}
                                    className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                    <td className="py-3 font-medium">{course.name}</td>
                                    <td className="text-right">
                                        <Link
                                            to={`/courses/${course.id}`}
                                            className="btn-outline px-4 py-2 text-sm"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
