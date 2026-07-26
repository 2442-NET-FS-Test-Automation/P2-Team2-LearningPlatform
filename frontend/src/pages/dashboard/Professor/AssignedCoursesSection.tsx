import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { CourseSelectDto, UserDetailsDto } from "../../../lib/types";
import { useAuth } from "../../../ctx/AuthCtx";
import { getUser } from "../../../api/usersRequest";

export default function AssignedCoursesSection() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<CourseSelectDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        setError(null);

        getUser(user.id)
            .then((data: UserDetailsDto) => {
                setCourses(data.professor?.courses ?? []);
            })
            .catch(() => {
                setError("Failed to load assigned courses.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user]);

    return (
        <div className="card space-y-6">
            <h2 className="text-2xl font-bold">My Courses</h2>

            {loading ? (
                <p className="text-muted">Loading courses...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
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
