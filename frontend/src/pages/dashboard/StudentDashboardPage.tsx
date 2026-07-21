import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, BarChart3, CalendarDays } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";
import ProfileSection from "./sections/ProfileSection";
import CoursesSection from "./sections/CoursesSection";
import ProgressSection from "./sections/ProgressSection";
import WeeklyScheduleSection from "./sections/WeeklyScheduleSection";

import { useAuth } from "../../ctx/AuthCtx";

import type { StudentStats, StudentCourseInfo, TabItem, CourseSchedule } from "../../lib/types";
import { calculateAverage, handleLogout } from "../../lib/funcs";

const Courses = [
        { Id: 1, Name: "Python Basics", Grade: 87, Completed: false, Schedule: [ 
                        { Day: 2, StartTime: "16:00", EndTime: "18:00" } as CourseSchedule,
                        { Day: 4, StartTime: "14:00", EndTime: "18:00" } as CourseSchedule
                    ] } as StudentCourseInfo,
        { Id: 2, Name: "React for web", Completed: false } as StudentCourseInfo,
        { Id: 3, Name: "Using Android Studio", Completed: false } as StudentCourseInfo,
        { Id: 4, Name: "Data Analytics", Grade: 55, Completed: true } as StudentCourseInfo
    ]
const tempstats = {
    TotalCourses: Courses.length,
    Completed: Courses.filter(c => c.Completed === true).length,
    AvgGrade: calculateAverage(Courses.filter(c => c.Completed === true).map(c => Number(c.Grade))),
} as StudentStats;

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const stats: StudentStats = tempstats
    
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
                        {activeTab === "courses" && <CoursesSection courses={Courses}  />}
                        {activeTab === "progress" && <ProgressSection TotalCourses={stats.TotalCourses} Completed={stats.Completed} AvgGrade={stats.AvgGrade} />}
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={Courses.filter(c => c.Completed === false)} />}
                    </div>
                </div>
            </div>
        </div>
    );
}