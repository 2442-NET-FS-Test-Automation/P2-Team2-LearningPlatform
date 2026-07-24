import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookCopy, CalendarClock, NotebookText, User, UsersRound } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";
import ProfileSection from "./sections/ProfileSection";

import ManageUsersSection from "./sections/ManageUsersSection";
import ManageCoursesSection from "./sections/ManageCoursesSection";
import ManageShiftsSection from "./sections/ManageShiftsSection";
import ManagerReportsSection from "./sections/ManagerReportsSection";
import EditProfileModal from "../../components/modals/EditProfileModal";

import { useAuth } from "../../ctx/AuthCtx";

import type { TabItem, UserInfo } from "../../lib/types";
import { handleLogout } from "../../lib/funcs";

export default function ManagerDashboardPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<string>("reports");
    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "reports", Label: "Reports", Icon: <NotebookText size={18} /> },
        { Id: "manageusers", Label: "Manage Users", Icon: <UsersRound size={18} /> },
        { Id: "managecourses", Label: "Manage Courses", Icon: <BookCopy size={18} /> },
        { Id: "manageshifts", Label: "Manage Shifts", Icon: <CalendarClock size={18} /> }
    ];

    const [showEditModal, setShowEditModal] = useState(false);

    if (user == null) {
        navigate("/login");
        return;
    };

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
                            firstName={user.firstName}
                            lastName={user.lastName}
                            email={user.email}
                            username={user.username}
                            role={user.role}
                            bio={user.bio}
                            onEdit={() => setShowEditModal(true)}
                        />}
                        {activeTab === "reports" && <ManagerReportsSection />}
                        {activeTab === "manageusers" && <ManageUsersSection />}
                        {activeTab === "managecourses" && <ManageCoursesSection />}
                        {activeTab === "manageshifts" && <ManageShiftsSection />}
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditProfileModal
                    userId={user.Id}
                    currentUser={user}
                    onClose={() => setShowEditModal(false)}
                    onUpdated={(updated: UserInfo) => {
                        setUser({ ...user, ...updated });
                        setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
}