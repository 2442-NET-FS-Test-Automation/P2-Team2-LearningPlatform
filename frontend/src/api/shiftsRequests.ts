import { api } from "./api";

export async function getShifts(page: number | null, pageSize: number | null) {
    const res = await api.get("/Shifts", {
        params: {
            page,
            pageSize
        }
    });

    return res.data;
}