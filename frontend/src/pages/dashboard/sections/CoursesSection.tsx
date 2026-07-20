import { Link } from "react-router-dom";

import type { UserCoursesInfo } from "../../../lib/types";
import { getGradeColor } from "../../../lib/funcs";

export default function CoursesSection({ courses }: UserCoursesInfo) {
    const pendingCourses = courses.filter(c => c.Completed === false);
    const completedCourses = courses.filter(c => c.Completed === true);

    return (
        <div>
            <div className="card space-y-4">
                <h2 className="text-xl font-semibold">Enrolled Courses</h2>
                {pendingCourses.length === 0 ? (
                    <p className="text-muted">You are not currently enrolled in any course.</p>
                ) : (
                    <ul className="space-y-3">
                        {pendingCourses.map((course) => (
                            <li key={course.Id} className="flex items-center justify-between">
                                <Link to={`/courses/${course.Id}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                    {course.Name}
                                </Link>
                                <div className="flex items-center gap-3">
                                    <button className="btn-outline text-red-600 border-red-600 px-4 py-2">
                                        Unenroll
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="card space-y-4 mt-5">
                <h2 className="text-xl font-semibold">Completed Courses</h2>
                {completedCourses.length === 0 ? (
                    <p className="text-muted">You have not completed any course.</p>
                ) : (
                    <ul className="space-y-3">
                        {completedCourses.map((course) => (
                            <li key={course.Id} className="flex items-center justify-between">
                                <Link to={`/courses/${course.Id}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                    {course.Name}
                                </Link>
                                <div className="flex items-center gap-3">
                                    {course.Grade != null && 
                                        <div className={`text-xl font-bold ${getGradeColor(course.Grade)}`}>
                                            {course.Grade}
                                        </div>
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        
    );
}