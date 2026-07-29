import { api } from "./api";
import type { Notification } from "../lib/types";

export async function getUserNotifications(unreadOnly = false, page = 1, pageSize = 10): Promise<Notification[]> {
    const response = await api.get("/Notifications", { params: { unreadOnly, page, pageSize } });
    return response.data.items;
}

export async function markNotificationAsRead(id: number): Promise<void> {
    await api.patch(`/Notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
    await api.patch("/Notifications/read-all");
}
