import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, GraduationCap, ListChecks, Plus, Archive, Trophy, Users, RotateCcw } from "lucide-react";

import ConfirmModal from "../../components/modals/ConfirmModal";
import ActivitySubmissionForm from "../../components/forms/ActivitySubmissionForm";
import CompletedActivityItem from "../../components/CompletedActivityItem";
import ProfessorActivityAccordion from "../../components/ProfessorActivityAccordion";
import CreateActivityModal from "../../components/modals/CreateActivityModal";
import CourseScheduleList from "../../components/CourseScheduleList";
import EditCourseModal from "../../components/modals/EditCourseModal";
import Loading from "../../components/layout/Loading";
import NotFoundPage from "../NotFoundPage";

import { useAuth } from "../../ctx/AuthCtx";

import { isStudentEnrolled, setCourseCompleted, studentEnroll } from "../../api/studentsRequests";
import { getCourseDetails } from "../../api/coursesRequests";
import {
    getStudentActivities,
    getCourseActivities,
    createActivity,
    deleteActivity,
    reactivateActivity,
    submitActivity,
    gradeSubmission
} from "../../api/activitiesRequests";

import type {
    ActivityWithSubmission,
    ActivityWithSubmissions,
    CourseDetails,
    CreateActivityDto
} from "../../lib/types";
import EnrollmentCard from "../../components/EnrollmentCard";
import ErrorMessage from "../../components/ErrorMessage";

export default function CourseDetailsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { id } = useParams();
    const [course, setCourse] = useState<CourseDetails>()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrolledCount, setEnrolledCount] = useState(0);

    const [showEditModal, setShowEditModal] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [forbid, setForbid] = useState(false);

    const [studentActivities, setStudentActivities] = useState<ActivityWithSubmission[]>([]);
    const [courseActivities, setCourseActivities] = useState<ActivityWithSubmissions[]>([]);
    const [submittingActivityId, setSubmittingActivityId] = useState<number | null>(null);
    const [showCreateActivity, setShowCreateActivity] = useState(false);
    const [deleteActivityId, setDeleteActivityId] = useState<number | null>(null);
    const [reactivateActivityId, setReactivateActivityId] = useState<number | null>(null);
    const [activityTab, setActivityTab] = useState<"active" | "archived">("active");
    
    useEffect(() => {
        getCourseDetails(Number(id))
            .then(res => {
                setCourse(res);
                setEnrolledCount(res.enrolledStudents);
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, [id, updated]);

    useEffect(() => {
        if (!user) return;
        getStudentActivities(Number(id))
            .then(setStudentActivities)
            .catch(e => console.log(e));
    }, [updated])

    useEffect(() => {
        if (!user) return;

        if (user.role === "Student") {
            isStudentEnrolled(user.id, Number(id))
                .then((res) => {
                    if (res.status === 200) {setIsEnrolled(true);}
                })
                .catch(() => {
                    setIsEnrolled(false);
                });
        } else if (user.role === "Professor" || user.role === "Admin") {
            getCourseActivities(Number(id), activityTab === "active")
                .then(setCourseActivities)
                .catch(e => {
                    if (e.status == 403) setForbid(true);
                });
        }
    }, [user, id, updated, activityTab]);

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
            .catch((e) => console.log(e))
            .finally(() => setIsEnrolling(false));
    };

    const pendingActivities = studentActivities.filter(a => !a.submission);
    const completedActivities = studentActivities.filter(a => a.submission);

    const handleComplete = () => {
        if (!user) return null;
        setCourseCompleted(user.id, Number(id))
            .then(() => {
                setUpdated(!updated);
            })
            .catch((e) => {
                switch (e.status) {
                    case 409: setError("Check your activities before submitting to complete"); break;
                    default: setError(e.status+"There was an error"); 
                } 
            })
    }
    const handleSubmitActivity = async (activityId: number, text: string) => {
        if (!user) return;
        setSubmittingActivityId(activityId);
        try {
            await submitActivity(activityId, text);
            setUpdated(prev => !prev);
        } catch (e) {
            console.log(e);
        } finally {
            setSubmittingActivityId(null);
        }
    };

    const handleGradeSubmission = async (_activityId: number, submissionId: number, grade: number, feedback: string) => {
        if (!user) return;
        await gradeSubmission(submissionId, grade, feedback);
        setUpdated(prev => !prev);
    };

    const handleCreateActivity = async (dto: CreateActivityDto): Promise<void> => {
        if (!user) return;
        await createActivity(Number(id), dto);
        setUpdated(prev => !prev);
        setShowCreateActivity(false);
    };

    const handleDeleteActivity = async () => {
        if (deleteActivityId == null) return;
        try {
            await deleteActivity(deleteActivityId);
            setUpdated(prev => !prev);
        } catch (e) {
            console.log(e);
        } finally {
            setDeleteActivityId(null);
        }
    };

    const handleReactivateActivity = async () => {
        if (reactivateActivityId == null) return;

        try {
            await reactivateActivity(reactivateActivityId);
            setUpdated(prev => !prev);
        }
        catch(e) {
            console.log(e);
        }
        finally {
            setReactivateActivityId(null);
        }
    };

    if (loading) return <Loading />;
    if (!course) return <NotFoundPage />;

    const displayName = course.name || "Untitled Course";
    const displayDescription = course.description || "No description available.";
    const about = "This course covers all the essential topics you need to master " + displayName + ". You'll work on hands-on projects and gain practical skills that you can apply immediately."
    const displayAbout = course.about || about;

    return (
    <>
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
            <section className="section-white py-12 overflow-hidden">
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

                    {/* Main content */}
                    <div className="grid gap-10 lg:grid-cols-3">
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

                            {user && (
                                user.role === "Student" ? (
                                <>
                                    <div className="divider-block">
                                        <h2 className="text-xl font-semibold">Pending Activities</h2>
                                        <p className="mt-2 text-muted">You have {pendingActivities.length} pending activities</p>
                                    </div>
                                    <div className="space-y-4">
                                        {pendingActivities.length === 0 ? (
                                            <p className="text-sm text-muted">Nothing due right now.</p>
                                        ) : (
                                            pendingActivities.map(a => (
                                                <ActivitySubmissionForm
                                                    key={a.id}
                                                    activity={a}
                                                    isSubmitting={submittingActivityId === a.id}
                                                    onSubmit={(text) => handleSubmitActivity(a.id, text)}
                                                />
                                            ))
                                        )}
                                    </div>

                                    <div className="divider-block">
                                        <h2 className="text-xl font-semibold">Completed Activities</h2>
                                        <p className="mt-2 text-muted">You have completed {completedActivities.length} activities</p>
                                    </div>
                                    <div className="space-y-4">
                                        {completedActivities.length === 0 ? (
                                            <p className="text-sm text-muted">No completed activities yet.</p>
                                        ) : (
                                            completedActivities.map(a => (
                                                <CompletedActivityItem key={a.id} activity={a} submission={a.submission!} />
                                            ))
                                        )}
                                    </div>
                                </>
                                ) : user.role === "Professor" && !forbid ? (
                                <>
                                    <div className="divider-block flex flex-col gap-4">
                                        {/* Título y botón */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-semibold">Student Activities</h2>
                                                <p className="mt-2 text-muted">
                                                    Your students have submitted
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setShowCreateActivity(true)}
                                                className="btn-outline gap-2 text-sm hover:opacity-80"
                                            >
                                                <div className="flex items-center gap-1 py-1">
                                                    <Plus size={16} />
                                                    New Activity
                                                </div>
                                            </button>
                                        </div>

                                        {/* Selector centrado */}
                                        <div className="flex justify-center">
                                            <div className="flex gap-2 border-b">
                                                <button
                                                    onClick={() => setActivityTab("active")}
                                                    className={`px-4 py-2 ${
                                                        activityTab === "active"
                                                            ? "border-b-2 border-blue-500 text-blue-600"
                                                            : "text-slate-500"
                                                    }`}
                                                >
                                                    Active
                                                </button>

                                                <button
                                                    onClick={() => setActivityTab("archived")}
                                                    className={`px-4 py-2 ${
                                                        activityTab === "archived"
                                                            ? "border-b-2 border-blue-500 text-blue-600"
                                                            : "text-slate-500"
                                                    }`}
                                                >
                                                    Archived
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {courseActivities.length === 0 ? (
                                            <p className="text-sm text-muted">No activities created for this course yet.</p>
                                        ) : (
                                            courseActivities.map(a => (
                                                <ProfessorActivityAccordion
                                                    key={a.id}
                                                    activity={a}
                                                    activityTab={activityTab}
                                                    onGrade={(submissionId, grade, feedback) =>
                                                        handleGradeSubmission(a.id, submissionId, grade, feedback)
                                                    }
                                                    onDelete={(activityId) => setDeleteActivityId(activityId)}
                                                    onReactivate={(activityId) => setReactivateActivityId(activityId)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </>
                                ) : user.role === "Admin" && (
                                    <>
                                        <div className="divider-block flex flex-col gap-4">

                                            {/* Título + botón */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-xl font-semibold">
                                                        Activities
                                                    </h2>
                                                    <p className="mt-2 text-muted">
                                                        Manage course activities
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => setShowCreateActivity(true)}
                                                    className="btn-outline gap-2 text-sm"
                                                >
                                                    <div className="flex items-center gap-1 py-1">
                                                        <Plus size={16} />
                                                        New Activity
                                                    </div>
                                                </button>
                                            </div>


                                            {/* Tabs centrados */}
                                            <div className="flex justify-center">
                                                <div className="flex gap-2 border-b">
                                                    <button
                                                        onClick={() => setActivityTab("active")}
                                                        className={`px-4 py-2 ${
                                                            activityTab === "active"
                                                                ? "border-b-2 border-blue-500 text-blue-600"
                                                                : "text-slate-500"
                                                        }`}
                                                    >
                                                        Active
                                                    </button>

                                                    <button
                                                        onClick={() => setActivityTab("archived")}
                                                        className={`px-4 py-2 ${
                                                            activityTab === "archived"
                                                                ? "border-b-2 border-blue-500 text-blue-600"
                                                                : "text-slate-500"
                                                        }`}
                                                    >
                                                        Archived
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="space-y-3">
                                            {courseActivities.length === 0 ? (
                                                <p className="text-sm text-muted">
                                                    No activities found.
                                                </p>
                                            ) : (
                                                courseActivities.map(a => (
                                                    <div
                                                        key={a.id}
                                                        className="card flex items-center justify-between"
                                                    >
                                                        <div>
                                                            <h3 className="font-semibold">
                                                                {a.title}
                                                            </h3>

                                                            <p className="text-sm text-muted">
                                                                Due {new Date(a.dueDate).toLocaleDateString()}
                                                            </p>
                                                        </div>

                                                        {activityTab === "active" ? (
                                                            <button
                                                                onClick={() => setDeleteActivityId(a.id)}
                                                                className="rounded-full p-2 text-amber-600 transition-colors hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                                                title="Archive activity"
                                                            >
                                                                <Archive size={18}/>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => setReactivateActivityId(a.id)}
                                                                className="rounded-full p-2 text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                                                                title="Reactivate activity"
                                                            >
                                                                <RotateCcw size={18}/>
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )
                            )}
                        </div>

                        {/* Side card */}
                        <div className="lg:col-span-1">
                            <div className="card sticky top-24 space-y-6 transition-shadow hover:shadow-lg">
                                {user ? (
                                    <>
                                        {user.role === "Student" && (
                                            isEnrolled ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-baseline justify-between">
                                                        <span className="big-stat">
                                                            {studentActivities.length > 0
                                                                ? Math.round((completedActivities.length / studentActivities.length) * 100)
                                                                : 100}%
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                                            <ListChecks size={16} />
                                                            {completedActivities.length}/{studentActivities.length} activities
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div
                                                            className="h-2 rounded-full bg-blue-600 transition-all dark:bg-blue-400"
                                                            style={{
                                                                width: `${studentActivities.length > 0
                                                                    ? (completedActivities.length / studentActivities.length) * 100
                                                                    : 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                    {pendingActivities.length === 0 &&
                                                        course.completed ?
                                                            <button
                                                                className="btn-primary w-full justify-center gap-2 text-center mt-2 emerald-600"
                                                            >
                                                                Completed
                                                            </button>
                                                        :
                                                            <button
                                                                className="btn-primary w-full justify-center gap-2 text-center mt-2"
                                                                onClick={() => {handleComplete()}}
                                                            >
                                                                Mark as completed
                                                            </button>
                                                    }
                                                    {error && <ErrorMessage error={error} />}
                                                </div>
                                            ) : (
                                                <EnrollmentCard
                                                    userLogged={true}
                                                    course={course}
                                                    enrolledCount={enrolledCount}
                                                    isEnrolling={isEnrolling}
                                                    handleClick={() => handleEnroll()}
                                                />
                                            )
                                        )}
                                        {user.role === "Professor" && (
                                            <div className="space-y-3">
                                                <div className="flex items-baseline justify-between">
                                                    <span className="big-stat">{courseActivities.length}</span>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">activities</span>
                                                </div>
                                                <p className="flex items-center gap-1.5 text-sm text-muted">
                                                    <GraduationCap size={16} />
                                                    {courseActivities.reduce((sum, a) => sum + a.submissions.filter(s => s.gradedAt == null).length, 0)} submissions awaiting grade
                                                </p>
                                            </div>
                                        )}
                                        {user.role === "Admin" && (
                                        <>
                                            <div className="flex items-baseline justify-between">
                                                <span className="big-stat">
                                                    {course.price === 0 ? "Free" : `${course.price}$`}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                                    <Users size={16} />
                                                    {enrolledCount} enrolled
                                                </span>
                                            </div>
                                            <button
                                                className="btn-primary w-full justify-center gap-2 text-center"
                                                onClick={() => setShowEditModal(true)}
                                            >
                                                Edit Course
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
                                        )}
                                    </>
                                ) : (
                                    <EnrollmentCard
                                        userLogged={false}
                                        course={course}
                                        enrolledCount={enrolledCount}
                                        isEnrolling={isEnrolling}
                                        handleClick={() => handleEnroll()}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {showEditModal && (
            <EditCourseModal
                courseId={Number(id)}
                onClose={() => setShowEditModal(false)}
                onUpdated={() => {
                    setUpdated(prev => !prev);
                    setShowEditModal(false);
                }}
            />
        )}
        {showCreateActivity && (
            <CreateActivityModal
                onClose={() => setShowCreateActivity(false)}
                onCreate={handleCreateActivity}
            />
        )}
        {deleteActivityId !== null &&
            <ConfirmModal
                title="Archive this activity?"
                message="Students will lose access to this activity and any submissions tied to it."
                confirmLabel="Archive"
                variant="danger"
                onConfirm={handleDeleteActivity}
                onCancel={() => setDeleteActivityId(null)}
            />
        }
        {reactivateActivityId !== null &&
            <ConfirmModal
                title="Reactivate this activity?"
                message="Students will be able to see and submit this activity again."
                confirmLabel="Reactivate"
                onConfirm={handleReactivateActivity}
                onCancel={() => setReactivateActivityId(null)}
            />
        }
    </>
    );
}
