import { useState } from "react";
import { User, BookOpen, BarChart3, LogOut } from "lucide-react";

import type { StudentTabs, UserInfo, UserStats, UserCourseInfo } from "../lib/types";
import ProfileSection from "./dashboard/ProfileSection";
import CoursesSection from "./dashboard/CoursesSection";
import ProgressSection from "./dashboard/ProgressSection";
import { calculateAverage } from "../lib/funcs";

const tempuser = {
    Name: "Jon",
    Email: "Jon@learnhub.com",
    Role: "Student",
    Username: "megajon",
    Bio: "Passionate about CS and AI.",
    Courses: [
        { Id: 1, Name: "Python Basics", Grade: 87, Completed: true } as UserCourseInfo,
        { Id: 2, Name: "React for web", Completed: false } as UserCourseInfo,
        { Id: 3, Name: "Using Android Studio", Completed: false } as UserCourseInfo,
        { Id: 4, Name: "Data Analytics", Grade: 55, Completed: true } as UserCourseInfo
    ]
} as UserInfo;
const tempstats = {
    TotalCourses: tempuser.Courses.length,
    Completed: tempuser.Courses.filter(c => c.Completed === true).length,
    AvgGrade: calculateAverage(tempuser.Courses.filter(c => c.Completed === true).map(c => Number(c.Grade))),
} as UserStats;

export default function StudentDashboardPage(){
    const user: UserInfo = tempuser
    const stats: UserStats = tempstats

    const [activeTab, setActiveTab] = useState<StudentTabs>("courses");

    const tabs: { id: StudentTabs; label: string; icon: React.ReactNode }[] = [
        { id: "profile", label: "Profile", icon: <User size={18} /> },
        { id: "courses", label: "My Courses", icon: <BookOpen size={18} /> },
        { id: "progress", label: "Progress", icon: <BarChart3 size={18} /> }
    ];

    return (
        <div className="section-white min-h-screen py-10">
            <div className="container-page">
                <h1 className="mb-8 text-3xl font-extrabold">Dashboard</h1>
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Side Navigation */}
                    <aside className="lg:w-64 shrink-0">
                        <nav className="card space-y-1 p-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                            <hr className="my-2 border-slate-200 dark:border-slate-700" />
                            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </nav>
                    </aside>
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
                    </div>
                </div>
            </div>
        </div>
    );
}