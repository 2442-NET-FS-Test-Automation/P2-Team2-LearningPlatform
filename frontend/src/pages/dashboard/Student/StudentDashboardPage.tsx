import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, BarChart3, CalendarDays, LayoutDashboard } from "lucide-react";

import DashboardSideNav from "../../../components/DashboardSideNav";
import ProfileSection from "../ProfileSection";
import CoursesSection from "./StudentCoursesSection";
import ProgressSection from "./StudentProgressSection";
import WeeklyScheduleSection from "../WeeklyScheduleSection";

import type { StudentCourseInfo, StudentStats, TabItem } from "../../../lib/types";
import { calculateAverage, handleLogout } from "../../../lib/funcs";
import { getStudentCourses } from "../../../api/studentsRequests";
import { useAuth } from "../../../ctx/AuthCtx";

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState<StudentCourseInfo[]>([]);
    const [onChange, setOnChange] = useState(false);
    useEffect(() => {
        if (!user) return;
        getStudentCourses(user.id)
            .then((res) => {
                setCourses(res.items);
                setStats(calculateStats(res.items))
            })
    }, [onChange])

    const [stats, setStats] = useState<StudentStats>({TotalCourses: 0, Completed: 0, AvgGrade: 0})
    
    const [activeTab, setActiveTab] = useState<string>("courses");
    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "courses", Label: "My Courses", Icon: <BookOpen size={18} /> },
        { Id: "schedule", Label: "Schedule", Icon: <CalendarDays size={18} /> },
        { Id: "progress", Label: "Progress", Icon: <BarChart3 size={18} /> }
    ];

    function calculateStats(courses: StudentCourseInfo[]): StudentStats {
        return {
            TotalCourses: courses.length,
            Completed: courses.filter(c => c.completed === true).length,
            AvgGrade: calculateAverage(courses.filter(c => c.completed === true).map(c => Number(c.grade)))
        }
    }

    if (!user) navigate("/login");
    
    return (
        <div className="section-white relative min-h-screen overflow-hidden py-10">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" aria-hidden="true" />
            
            <div className="container-page relative">
                <span className="eyebrow-badge">
                    <LayoutDashboard size={14} />
                    Student Dashboard
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
                        {activeTab === "courses" && <CoursesSection userId={user!.id} courses={courses} onChange={() => setOnChange((c) => !c)} />}
                        {activeTab === "progress" && <ProgressSection TotalCourses={stats.TotalCourses} Completed={stats.Completed} AvgGrade={stats.AvgGrade} />}
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={courses.filter(c => c.completed === false)} />}
                    </div>
                </div>
            </div>
        </div>
    );
}