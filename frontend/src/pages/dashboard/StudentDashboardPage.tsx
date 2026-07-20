import { useState } from "react";
import { User, BookOpen, BarChart3, CalendarDays } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";
import ProfileSection from "./sections/ProfileSection";
import CoursesSection from "./sections/CoursesSection";
import ProgressSection from "./sections/ProgressSection";
import WeeklyScheduleSection from "./sections/WeeklyScheduleSection";

import type { StudentInfo, StudentStats, StudentCourseInfo, TabItem, CourseSchedule } from "../../lib/types";
import { calculateAverage, handleLogout } from "../../lib/funcs";

const tempuser = {
    Name: "Jon",
    Email: "Jon@learnhub.com",
    Role: "Student",
    Username: "megajon",
    Bio: "Passionate about CS and AI.",
    Courses: [
        { Id: 1, Name: "Python Basics", Grade: 87, Completed: false, Schedule: [ 
                        { Day: 2, StartTime: "16:00", EndTime: "18:00" } as CourseSchedule,
                        { Day: 4, StartTime: "14:00", EndTime: "18:00" } as CourseSchedule
                    ] } as StudentCourseInfo,
        { Id: 2, Name: "React for web", Completed: false } as StudentCourseInfo,
        { Id: 3, Name: "Using Android Studio", Completed: false } as StudentCourseInfo,
        { Id: 4, Name: "Data Analytics", Grade: 55, Completed: true } as StudentCourseInfo
    ]
} as StudentInfo;
const tempstats = {
    TotalCourses: tempuser.Courses.length,
    Completed: tempuser.Courses.filter(c => c.Completed === true).length,
    AvgGrade: calculateAverage(tempuser.Courses.filter(c => c.Completed === true).map(c => Number(c.Grade))),
} as StudentStats;

export default function StudentDashboardPage(){
    const user: StudentInfo = tempuser
    const stats: StudentStats = tempstats

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
                        {activeTab === "profile" && <ProfileSection 
                            Name={user.Name}
                            Email={user.Email} 
                            Username={user.Username} 
                            Role={user.Role}
                            Bio={user.Bio}
                        />}
                        {activeTab === "courses" && <CoursesSection courses={user.Courses}  />}
                        {activeTab === "progress" && <ProgressSection TotalCourses={stats.TotalCourses} Completed={stats.Completed} AvgGrade={stats.AvgGrade} />}
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={user.Courses.filter(c => c.Completed === false)} />}
                    </div>
                </div>
            </div>
        </div>
    );
}