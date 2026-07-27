import { useState } from "react";
import { Link } from "react-router-dom";

import type { StudentCourseInfo } from "../../../lib/types";
import { formatSchedule, getGradeColor } from "../../../lib/funcs";
import { studentUnenroll } from "../../../api/studentsRequests";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import { BookOpen, Calendar, GraduationCap } from "lucide-react";

interface CoursesSectionProps {
    userId: number
    courses: StudentCourseInfo[],
    onChange: () => void
}

export default function CoursesSection({ userId, courses, onChange }: CoursesSectionProps) {
    const pendingCourses = courses.filter(c => c.completed === false);
    const completedCourses = courses.filter(c => c.completed === true);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<StudentCourseInfo | null>(null);

    function handleUnenroll(courseId: number) {
        studentUnenroll(userId, courseId)
            .then((res) => {
                if (res == 200) onChange();
            })
    }

    return (
        <>
        <div className="space-y-3">
            <div className="card space-y-4 transition-shadow hover:shadow-lg">
                <h2 className="flex items-center gap-3 text-xl font-semibold">
                    <BookOpen size={25} className="text-blue-600 dark:text-blue-400" />
                    Enrolled Courses
                </h2>

                {pendingCourses.length === 0 ? (
                    <p className="text-muted">You are not currently enrolled in any course.</p>
                ) : (
                    <ul className="space-y-2">
                        {pendingCourses.map((course) => (
                            <li key={course.id} className="flex items-center justify-between rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div>
                                    <Link to={`/courses/${course.id}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                        {course.name}
                                    </Link>
                                    {course.schedule && course.schedule.length > 0 && (
                                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                                            <Calendar size={12} />
                                            {formatSchedule(course.schedule)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="btn-outline px-4 py-2 text-sm text-red-600 border-red-300 hover:bg-red-50 dark:text-red-700/80 dark:border-red-600/60 dark:hover:bg-red-900/30"
                                        onClick={() => {
                                            setSelectedCourse(course);
                                            setShowConfirmModal(true);
                                        }}
                                    >
                                        Unenroll
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="card space-y-4 transition-shadow hover:shadow-lg">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <GraduationCap size={25} className="text-blue-600 dark:text-blue-400" />
                    Completed Courses
                </h2>

                {completedCourses.length === 0 ? (
                    <p className="text-muted">You have not completed any course.</p>
                ) : (
                    <ul className="space-y-2">
                        {completedCourses.map((course) => (
                            <li key={course.id} className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <Link to={`/courses/${course.id}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                    {course.name}
                                </Link>
                                <div className="flex items-center gap-3">
                                    {course.grade != null && 
                                        <div className={`text-xl font-bold ${getGradeColor(course.grade)}`}>
                                            {course.grade}
                                        </div>
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        {showConfirmModal && selectedCourse && (
            <ConfirmModal title={"About to Unenroll"} message={"Are you sure you want to unenroll from "+selectedCourse.name}
                variant="danger" 
                onConfirm={() => {
                    handleUnenroll(selectedCourse.id);
                    setSelectedCourse(null);
                    setShowConfirmModal(false);
                }} 
                onCancel={() => {
                    setSelectedCourse(null);
                    setShowConfirmModal(false);
                }} />
        )}
    </>
    );
}