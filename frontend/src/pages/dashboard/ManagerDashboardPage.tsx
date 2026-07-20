import { useState } from "react";
import { BookCopy, CalendarClock, NotebookText, User, UsersRound } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";

import type { TabItem, UserInfo } from "../../lib/types";
import { handleLogout } from "../../lib/funcs";
import ProfileSection from "./sections/ProfileSection";

const tempUser = {
    Name: "JonAdmin",
    Email: "JonAdmin@learnhub.com",
    Role: "Admin",
    Username: "adminjon",
    Bio: "Passionate about CS and AI and managing.",
} as UserInfo

export default function ManagerDashboardPage() {
    const user = tempUser;
    const [activeTab, setActiveTab] = useState<string>("courses");

    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "manageusers", Label: "Manage Users", Icon: <UsersRound size={18} /> },
        { Id: "managecourses", Label: "Manage Courses", Icon: <BookCopy size={18} /> },
        { Id: "manageshifts", Label: "Manage Shifts", Icon: <CalendarClock size={18} /> },
        { Id: "reports", Label: "Reports", Icon: <NotebookText size={18} /> },  
    ];

    return (
        <div className="section-white min-h-screen py-10">
            <div className="container-page">
                <h1 className="mb-8 text-3xl font-extrabold">Manager Dashboard</h1>
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
                    </div>
                </div>
            </div>
        </div>
    );
 }