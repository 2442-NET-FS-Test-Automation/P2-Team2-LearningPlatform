import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, BarChart3, CalendarDays } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";
import ProfileSection from "./sections/ProfileSection";
import CoursesSection from "./sections/CoursesSection";
import ProgressSection from "./sections/ProgressSection";
import WeeklyScheduleSection from "./sections/WeeklyScheduleSection";

import { useAuth } from "../../ctx/AuthCtx";

import type { StudentCourseInfo, StudentStats, TabItem } from "../../lib/types";
import { calculateAverage, handleLogout } from "../../lib/funcs";

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [courses, setCourses] = useState<StudentCourseInfo[]>([]);
    useEffect(() => {
        // TODO: Endpoint not done yet so no info can be obtained
        // Get courses of current student
    }, [])

    const [stats, setStats] = useState<StudentStats>({
        TotalCourses: courses.length,
        Completed: courses.filter(c => c.Completed === true).length,
        AvgGrade: calculateAverage(courses.filter(c => c.Completed === true).map(c => Number(c.Grade))),
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
    
    if (user == null) {
        navigate("/login"); 
        return;
    };

    return (
        <div className="section-white min-h-screen py-10">
            <div className="container-page">
                <h1 className="mb-8 text-3xl font-extrabold">Dashboard</h1>
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Side Navigation */}
                    <DashboardSideNav Tabs={tabs} ActiveTab={activeTab} OnTabChange={setActiveTab} OnLogout={handleLogout} />

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === "profile" && <ProfileSection 
                            firstName={user.firstName}
                            lastName={user.lastName}
                            email={user.email} 
                            username={user.username} 
                            role={user.role}
                            bio={user.bio}
                        />}
                        {activeTab === "courses" && <CoursesSection courses={courses}  />}
                        {activeTab === "progress" && <ProgressSection TotalCourses={stats.TotalCourses} Completed={stats.Completed} AvgGrade={stats.AvgGrade} />}
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={courses.filter(c => c.Completed === false)} />}
                    </div>
                </div>
            </div>
        </div>
    );
}