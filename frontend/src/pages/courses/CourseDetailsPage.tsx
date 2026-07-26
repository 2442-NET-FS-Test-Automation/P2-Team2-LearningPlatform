import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Loader2, Trophy, Users } from "lucide-react";

import CourseScheduleList from "../../components/CourseScheduleList";
import NotFoundPage from "../NotFoundPage";

import type { CourseDetails } from "../../lib/types";
import { useAuth } from "../../ctx/AuthCtx";
import { useEffect, useState } from "react";
import { getCourseDetails } from "../../api/coursesRequests";
import { isStudentEnrolled, studentEnroll } from "../../api/studentsRequests";

export default function CourseDetailsPage() {    
    const { user } = useAuth();
    const navigate = useNavigate();

    const { id } = useParams();
    const [course, setCourse] = useState<CourseDetails>()

    const [loading, setLoading] = useState(true);

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrolledCount, setEnrolledCount] = useState(0);

    useEffect(() => {
        getCourseDetails(Number(id))
            .then(res => {
                setCourse(res);
                setEnrolledCount(res.enrolledStudents)                
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, [id])

    useEffect(() => {
        if(!user) return;
        isStudentEnrolled(user.id, Number(id))
            .then((res) => {
                if (res.status == 404) return;
                if (res.status == 200) setIsEnrolled(true);
            })
    }, [])

    const handleEnroll = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (isEnrolled || isEnrolling) return;

        setIsEnrolling(true);
        studentEnroll(user.id, Number(id))
            .then(() => {
                setIsEnrolled(true);
                setEnrolledCount((prev) => prev + 1);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setIsEnrolling(false);
            })
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400">Loading course details…</p>
                </div>
            </div>
        );
    }

    if (!course) return (<NotFoundPage />);
    
    const displayName = course.name || "Untitled Course";
    const displayDescription = course.description || "No description available.";

    const about = "This course covers all the essential topics you need to master " + displayName + ". You'll work on hands-on projects and gain practical skills that you can apply immediately."
    const displayAbout = course.about || about;
    
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Header Image */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                    src={`/course_img/${course.category}.jpg`}
                    alt={`${course.category} cover`}
                    className="h-full w-full object-cover"
                    onError={(e) => {(e.target as HTMLImageElement).src = "/course_img/default.jpg";}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Course Details */}
            <section className="section-white py-12 overflow-hidden py-12">
                <div className="container-page relative">
                    <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                        <Link to="/courses" className="hover:text-blue-600 dark:hover:text-blue-400">
                            Courses
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            {displayName}
                        </span>
                    </nav>

                    <div className="grid gap-10 lg:grid-cols-3">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <span className="blue-accent-chip rounded-full px-3 py-1 text-xs font-semibold">
                                    {course.category}
                                </span>
                                <h1 className="mt-3 text-4xl font-extrabold leading-tight">
                                    {displayName}
                                </h1>
                                <p className="mt-4 text-lg text-muted">
                                    {displayDescription}
                                </p>
                            </div>

                            <div className="divider-block">
                                <h2 className="text-xl font-semibold">Instructor</h2>
                                <p className="mt-1 text-muted">{course.instructor}</p>
                            </div>

                            <CourseScheduleList Schedule={course.schedule} />
                            
                            <div className="divider-block">
                                <h2 className="text-xl font-semibold">About this course</h2>
                                <p className="mt-2 text-muted">{displayAbout}</p>
                            </div>
                        </div>

                        {/* Enrollment card */}
                        <div className="lg:col-span-1">
                            <div className="card sticky top-24 space-y-6 transition-shadow hover:shadow-lg">
                                <div className="flex items-baseline justify-between">
                                    <span className="big-stat">
                                        {course.price === 0 ? ("Free") : (`${course.price}$`)}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                        <Users size={16} />
                                        {enrolledCount} enrolled
                                    </span>
                                </div>
                                {isEnrolled ? (
                                    <button
                                        disabled
                                        className="btn-primary w-full justify-center gap-2 text-center bg-emerald-600 opacity-100 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-500"
                                    >
                                        <div className="flex items-center">
                                            <CheckCircle2 size={18} />
                                            <p className="mx-auto">Enrolled</p>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={isEnrolling}
                                        className="btn-primary w-full justify-center gap-2 text-center disabled:opacity-70"
                                    >
                                        <div className="flex items-center">
                                            {isEnrolling && <Loader2 size={18} className="animate-spin" />}
                                            <p className="mx-auto">
                                                {!user
                                                    ? "Login to enroll"
                                                    : isEnrolling
                                                        ? "Enrolling..."
                                                        : "Enroll Now"}
                                            </p>
                                        </div>
                                    </button>
                                )}

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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}