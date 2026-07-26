import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, BarChart3, CalendarDays } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";
import ProfileSection from "./sections/ProfileSection";
import CoursesSection from "./sections/CoursesSection";
import ProgressSection from "./sections/ProgressSection";
import WeeklyScheduleSection from "./sections/WeeklyScheduleSection";

import type { StudentCourseInfo, StudentStats, TabItem } from "../../lib/types";
import { calculateAverage, handleLogout } from "../../lib/funcs";
import { getStudentCourses } from "../../api/studentsRequests";
import { useAuth } from "../../ctx/AuthCtx";

export default function StudentDashboardPage() {
    const { user } = useAuth();

    const [courses, setCourses] = useState<StudentCourseInfo[]>([]);
    useEffect(() => {
        if (!user) return;
        getStudentCourses(user.id)
            .then((res) => {
                console.log(res);
                setCourses(res.items);
            })
    }, [])

    const [stats, setStats] = useState<StudentStats>({
        TotalCourses: courses.length,
        Completed: courses.filter(c => c.completed === true).length,
        AvgGrade: calculateAverage(courses.filter(c => c.completed === true).map(c => Number(c.grade))),
    })

    useEffect(() => {
        // TODO: Endpoint not done yet so no info can be obtained
        // Get stats of current student

    }, [])
    
    const [activeTab, setActiveTab] = useState<string>("courses");
    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "courses", Label: "My Courses", Icon: <BookOpen size={18} /> },
        { Id: "schedule", Label: "Schedule", Icon: <CalendarDays size={18} /> },
        { Id: "progress", Label: "Progress", Icon: <BarChart3 size={18} /> }
    ];
    
    return (
        <div className="section-white min-h-screen py-10">
            <div className="container-page">
                <h1 className="mb-8 text-3xl font-extrabold">Dashboard</h1>
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Side Navigation */}
                    <DashboardSideNav Tabs={tabs} ActiveTab={activeTab} OnTabChange={setActiveTab} OnLogout={handleLogout} />

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === "profile" && <ProfileSection />}
                        {activeTab === "courses" && <CoursesSection courses={courses}  />}
                        {activeTab === "progress" && <ProgressSection TotalCourses={stats.TotalCourses} Completed={stats.Completed} AvgGrade={stats.AvgGrade} />}
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={courses.filter(c => c.completed === false)} />}
                    </div>
                </div>
            </div>
        </div>
    );
}