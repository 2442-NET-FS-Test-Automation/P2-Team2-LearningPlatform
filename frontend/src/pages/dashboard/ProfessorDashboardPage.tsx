import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, User } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";
import ProfileSection from "./sections/ProfileSection";
import WeeklyScheduleSection from "./sections/WeeklyScheduleSection";
import EditProfileModal from "../../components/modals/EditProfileModal";

import { useAuth } from "../../ctx/AuthCtx";

import type { TabItem, UserInfo } from "../../lib/types";
import { handleLogout } from "../../lib/funcs";

export default function ProfessorDashboardPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState<string>("courses");
    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> },
        { Id: "courses", Label: "My Courses", Icon: <BookOpen size={18} />},
        { Id: "schedule", Label: "Schedule", Icon: <CalendarDays size={18} />}
    ];

    const [showEditModal, setShowEditModal] = useState(false);

    if (user == null) {
        navigate("/login");
        return;
    };

    return (
        <div className="section-white min-h-screen py-10">
            <div className="container-page">
                <h1 className="mb-8 text-3xl font-extrabold">Professor Dashboard</h1>
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
                        {activeTab === "schedule" && <WeeklyScheduleSection Courses={[]} />}
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