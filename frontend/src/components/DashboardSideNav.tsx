import { LogOut } from "lucide-react";
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
    return (
    <aside className={`lg:w-64 shrink-0 ${ClassName}`}>
        <nav className="card space-y-1 p-4">
            {Tabs.map((tab) => (
                <button
                    key={tab.Id}
                    onClick={() => OnTabChange(tab.Id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors 
              ${ActiveTab === tab.Id
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                >
                    {tab.Icon}
                    {tab.Label}
                </button>
            ))}

            {OnLogout && (
                <>
                    <hr className="my-2 border-slate-200 dark:border-slate-700" />
                    <button
                        onClick={OnLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </>
            )}
        </nav>
    </aside>
    );
}