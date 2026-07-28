import { Clock, Loader2, Trophy, Users } from "lucide-react";
import type { CourseDetails } from "../lib/types";

interface EnrollmentCardProps {
    userLogged: boolean,
    course: CourseDetails,
    enrolledCount: number,
    isEnrolling: boolean,
    handleClick: () => void
}

export default function EnrollmentCard({
    userLogged,
    course,
    enrolledCount,
    isEnrolling,
    handleClick
}: EnrollmentCardProps){
    const occupancy = (course.enrolledStudents / course.capacity) * 100;
    const isFull = enrolledCount >= course.capacity;
    return(
        <>
            <div className="flex items-baseline justify-between">
                <span className="big-stat">
                    {course.price === 0 ? ("Free") : (`${course.price}$`)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Users size={16} />
                    {enrolledCount} enrolled
                </span>
            </div>
            <button
                onClick={handleClick}
                disabled={isEnrolling}
                className="btn-primary w-full justify-center gap-2 text-center disabled:opacity-70"
            >
                <div className="flex items-center">
                    {isEnrolling && <Loader2 size={18} className="animate-spin" />}
                    <p className="mx-auto">
                        {userLogged ? (
                            isEnrolling
                                ? "Enrolling..."
                                : "Enroll Now"
                        ) : (
                            "Login to Enroll"
                        )
                        }
                        
                    </p>
                </div>
            </button>
            <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Available seats</span>
                    <span>
                        {course.capacity - enrolledCount}/{course.capacity}
                    </span>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${
                            isFull
                                ? "bg-red-500"
                                : occupancy > 80
                                    ? "bg-amber-500"
                                    : "bg-blue-600"
                        }`}
                        style={{ width: `${occupancy}%` }}
                    />
                </div>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
                {course.hours != null && (
                    <div className="flex">
                        <Clock size={20} />
                        <p className="mx-2">{course.hours} hours of content</p>
                    </div>
                )}
                {course.certification === true && (
                    <div className="flex my-3">
                        <Trophy size={20} />
                        <p className="mx-2">Certificate of completion</p>
                    </div>
                )}
            </div>
        </>
    );
}