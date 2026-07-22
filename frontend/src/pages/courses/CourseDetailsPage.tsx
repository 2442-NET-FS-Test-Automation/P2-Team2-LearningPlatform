import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, Trophy } from "lucide-react";

import CourseScheduleList from "../../components/CourseScheduleList";
import NotFoundPage from "../NotFoundPage";

import type { CourseDetails, CourseSchedule } from "../../lib/types";
import { useAuth } from "../../ctx/AuthCtx";

export default function CourseDetailsPage() {
    // Temp Data
    const courses: CourseDetails[] = [
        {
            Id: 1, Name: "Python Basics", Description: "A course about programming in Python", CategoryName: "Programming",
            About: "Youll see everythin pythonic.",
            Hours: 15,
            Price: 150,
            Certificate: true,
            Instructor: "Jane Doe",
            Enrolled: 152,
            Schedule: [ 
                { Day: 2, StartTime: "04:00", EndTime: "06:00" } as CourseSchedule,
                { Day: 4, StartTime: "04:00", EndTime: "06:00" } as CourseSchedule
            ]
        },
        {
            Id: 2, Name: "", Description: "", CategoryName: "WebDevelopment",
            About: "",
            Price: 0,
            Certificate: false,
            Instructor: "el pepe",
            Enrolled: 2
        }
    ];
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const { id } = useParams();
    const course: CourseDetails = courses.find(c => c.Id === Number(id)) as CourseDetails;
    if (!course) return (<NotFoundPage />);
    
    const displayName = course.Name || "Untitled Course";
    const displayDescription = course.Description || "No description available.";

    const about = "This course covers all the essential topics you need to master " + displayName + ". You'll work on hands-on projects and gain practical skills that you can apply immediately."
    const displayAbout = course.About || about;
    
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Header Image */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                    src={`/course_img/${course.CategoryName}.jpg`}
                    alt={`${course.CategoryName} cover`}
                    className="h-full w-full object-cover"
                    onError={(e) => {(e.target as HTMLImageElement).src = "/course_img/default.jpg";}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Course Details */}
            <section className="section-white py-12">
                <div className="container-page">
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
                                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                    {course.CategoryName}
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
                                <p className="mt-1 text-muted">{course.Instructor}</p>
                            </div>

                            <CourseScheduleList Schedule={course.Schedule} />
                            
                            <div className="divider-block">
                                <h2 className="text-xl font-semibold">About this course</h2>
                                <p className="mt-2 text-muted">{displayAbout}</p>
                            </div>
                        </div>

                        {/* Enrollment card */}
                        <div className="lg:col-span-1">
                            <div className="card sticky top-24 space-y-6">
                                <div className="flex items-baseline justify-between">
                                    <span className="big-stat">
                                        {course.Price === 0 ? ("Free") : (`${course.Price}$`)}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {course.Enrolled} enrolled
                                    </span>
                                </div>

                                {user ? (
                                    <button className="btn-primary w-full justify-center text-center">
                                        Enroll Now
                                    </button>
                                ) : (
                                    <button onClick={() => navigate("/login")} className="btn-primary w-full justify-center text-center">
                                        Login to enroll
                                    </button>
                                )}

                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {course.Hours != null && (
                                        <div className="flex">
                                            <Clock size={20} />
                                            <p className="mx-2">{course.Hours} hours of content</p>
                                        </div>
                                    )}
                                    {course.Certificate === true && (
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