import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useAuth } from "../ctx/AuthCtx";

import type { TabItem } from "../lib/types";

export type DashboardSideNavProps = {
    Tabs: TabItem[];
    ActiveTab: string;
    OnTabChange: (tabId: string) => void;
    OnLogout?: () => void;
    ClassName?: string;
}

export default function DashboardSideNav({
    Tabs,
    ActiveTab,
    OnTabChange,
    OnLogout,
    ClassName = "",
}: DashboardSideNavProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    
    return (
    <aside className={`lg:sticky lg:w-64 shrink-0 ${ClassName}`}>
        <nav className="flex flex-col card p-4">
            <div className="space-y-1">
                {Tabs.map((tab) => (
                    <button
                        key={tab.Id}
                        onClick={() => OnTabChange(tab.Id)}
                        className={`flex w-full items-center gap-3 rounded-lg border-l-4 px-4 py-3 text-sm font-medium transition-colors 
                            ${ActiveTab === tab.Id
                                ? "blue-accent-chip border-blue-600 dark:border-blue-400"
                                : "border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                    >
                        {tab.Icon}
                        {tab.Label}
                    </button>
                ))}
            </div>


            {OnLogout && (
                <div className="mt-auto">
                    <hr className="my-2 border-slate-200 dark:border-slate-700" />
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg border-transparent border-l-4 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            )}
        </nav>
    </aside>
    );
}