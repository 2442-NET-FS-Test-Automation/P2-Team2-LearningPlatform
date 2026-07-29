import { useState, useEffect } from "react";
import { Bell, Check, CheckCircle2 } from "lucide-react";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../api/notificationsRequests";
import type { Notification } from "../../lib/types";

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await getUserNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-500"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 z-50">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="mt-2 flex max-h-80 flex-col gap-2 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                No notifications
                            </p>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`flex items-start gap-3 rounded-md p-3 text-sm transition ${
                                        notification.isRead 
                                            ? "bg-transparent text-slate-600 dark:text-slate-400" 
                                            : "bg-blue-50 text-slate-900 dark:bg-blue-900/20 dark:text-slate-100"
                                    }`}
                                >
                                    <div className="flex-1">
                                        <p>{notification.message}</p>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {!notification.isRead && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                            title="Mark as read"
                                        >
                                            <CheckCircle2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
