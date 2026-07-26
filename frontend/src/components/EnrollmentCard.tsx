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