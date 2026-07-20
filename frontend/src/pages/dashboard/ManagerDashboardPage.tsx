import { useState } from "react";
import { User } from "lucide-react";

import DashboardSideNav from "../../components/DashboardSideNav";

import type { TabItem } from "../../lib/types";
import { handleLogout } from "../../lib/funcs";

 export default function ManagerDashboardPage() {
    const [activeTab, setActiveTab] = useState<string>("courses");

    const tabs: TabItem[] = [
        { Id: "profile", Label: "Profile", Icon: <User size={18} /> }
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
                    </div>
                </div>
            </div>
        </div>
    );
 }