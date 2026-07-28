import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, LayoutDashboard, User } from "lucide-react";

import DashboardSideNav from "../../../components/DashboardSideNav";
import ProfileSection from "../ProfileSection";
import WeeklyScheduleSection from "../WeeklyScheduleSection";
import AssignedCoursesSection from "./AssignedCoursesSection";

import { useAuth } from "../../../ctx/AuthCtx";

import type { CourseInfo, ShiftDto, TabItem } from "../../../lib/types";
import { handleLogout } from "../../../lib/funcs";
import { getOwnShift, getProfessorCourses } from "../../../api/professorRequests";

export default function ProfessorDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState<CourseInfo[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [courseError, setCourseError] = useState<string | null>(null);

    const [shift, setShift] = useState<ShiftDto | null>();
    const [loadingShift, setLoadingShift] = useState(true);
    const [shiftError, setShiftError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setLoadingCourses(true);
        setLoadingShift(true);
        setCourseError(null);
        setShiftError(null);

        getProfessorCourses()
            .then((res) => {
                setCourses(res ?? []);
            })
            .catch(() => {
                setCourseError("Failed to load assigned courses.");
            })
            .finally(() => {
                setLoadingCourses(false);
            });

        getOwnShift()
            .then((res) => {
                console.log(res);
                setShift(res);
            })
            .catch(() => {
                setShiftError("Failed to load shift")
            })
            .finally(() => {
                setLoadingShift(false);
            })
    }, [user]);

    
    const [activeTab, setActiveTab] = useState<string>("courses");
    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "courses", Label: "My Courses", Icon: <BookOpen size={18} />},
        { Id: "schedule", Label: "Schedule", Icon: <CalendarDays size={18} />}
    ];

    if (!user) navigate("/login");

    return (
        <div className="section-light relative min-h-screen overflow-hidden py-10">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" aria-hidden="true" />
            
            <div className="container-page relative">
                <span className="eyebrow-badge">
                    <LayoutDashboard size={14} />
                    Professor Dashboard
                </span>
                <h1 className="mt-4 mb-8 text-3xl font-extrabold leading-tight sm:text-4xl">
                    Welcome back{user ? <>, <span className="text-blue-600 dark:text-blue-400">{user.firstName}</span></> : null}
                </h1>
                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* Side Navigation */}
                    <DashboardSideNav Tabs={tabs} ActiveTab={activeTab} OnTabChange={setActiveTab} OnLogout={handleLogout} />

                    {/* Main Content */}
                    <div key={activeTab} className="flex-1 animate-fade-in-up">
                        {activeTab === "profile" && <ProfileSection />}
                        {activeTab === "courses" && <AssignedCoursesSection courses={courses} loading={loadingCourses} error={courseError} />}
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={courses} 
                            loading={loadingShift} error={shiftError}
                            shift={shift} showShift={true} />}
                    </div>
                </div>
            </div>
        </div>
    );
 }