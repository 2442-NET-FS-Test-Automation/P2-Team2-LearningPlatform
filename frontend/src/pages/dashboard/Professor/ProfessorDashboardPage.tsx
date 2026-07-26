import { useState } from "react";
import { BookOpen, CalendarDays, User } from "lucide-react";

import DashboardSideNav from "../../../components/DashboardSideNav";
import ProfileSection from "../ProfileSection";
import WeeklyScheduleSection from "../WeeklyScheduleSection";
import AssignedCoursesSection from "./AssignedCoursesSection";

import type { TabItem } from "../../../lib/types";
import { handleLogout } from "../../../lib/funcs";

export default function ProfessorDashboardPage() {
    const [activeTab, setActiveTab] = useState<string>("courses");
    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "courses", Label: "My Courses", Icon: <BookOpen size={18} />},
        { Id: "schedule", Label: "Schedule", Icon: <CalendarDays size={18} />}
    ];

    return (
        <div className="section-white min-h-screen py-10">
            <div className="container-page">
                <h1 className="mb-8 text-3xl font-extrabold">Professor Dashboard</h1>
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Side Navigation */}
                    <DashboardSideNav Tabs={tabs} ActiveTab={activeTab} OnTabChange={setActiveTab} OnLogout={handleLogout} />

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === "profile" && <ProfileSection />}
                        {activeTab === "courses" && <AssignedCoursesSection />}
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={[]} />}
                    </div>
                </div>
            </div>
        </div>
    );
 }