import { useState } from "react";
import { BookCopy, CalendarClock, LayoutDashboard, NotebookText, User, UsersRound } from "lucide-react";

import DashboardSideNav from "../../../components/DashboardSideNav";
import ProfileSection from "../ProfileSection";

import ManageUsersSection from "./ManagerUsersSection";
import ManageCoursesSection from "./ManagerCoursesSection";
import ManageShiftsSection from "./ManagerShiftsSection";
import ManagerReportsSection from "./ManagerReportsSection";


import type { TabItem } from "../../../lib/types";
import { handleLogout } from "../../../lib/funcs";

export default function ManagerDashboardPage() {
    const [activeTab, setActiveTab] = useState<string>("reports");
    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "reports", Label: "Reports", Icon: <NotebookText size={18} /> },
        { Id: "manageusers", Label: "Manage Users", Icon: <UsersRound size={18} /> },
        { Id: "managecourses", Label: "Manage Courses", Icon: <BookCopy size={18} /> },
        { Id: "manageshifts", Label: "Manage Shifts", Icon: <CalendarClock size={18} /> }
    ];

    return (
        <div className="section-light relative min-h-screen overflow-hidden py-10">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" aria-hidden="true" />
            
            <div className="container-page relative">
                <span className="eyebrow-badge">
                    <LayoutDashboard size={14} />
                    Manager Dashboard
                </span>
                <h1 className="mt-4 mb-8 text-3xl font-extrabold leading-tight sm:text-4xl">
                    Manager <span className="text-blue-600 dark:text-blue-400">Dashboard</span>
                </h1>
                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* Side Navigation */}
                    <DashboardSideNav Tabs={tabs} ActiveTab={activeTab} OnTabChange={setActiveTab} OnLogout={handleLogout} />

                    {/* Main Content */}
                    <div key={activeTab} className="flex-1 animate-fade-in-up">
                        {activeTab === "profile" && <ProfileSection />}
                        {activeTab === "reports" && <ManagerReportsSection />}
                        {activeTab === "manageusers" && <ManageUsersSection />}
                        {activeTab === "managecourses" && <ManageCoursesSection />}
                        {activeTab === "manageshifts" && <ManageShiftsSection />}
                    </div>
                </div>
            </div>
        </div>
    );
}