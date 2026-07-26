import type { CreateShiftDto, UpdateShiftDto } from "../lib/types";
import { api } from "./api";

export async function getShifts(page: number | null, pageSize: number | null, search: string) {
    const res = await api.get("/Shifts", {
        params: {
            page,
            pageSize,
            search
        }
    });
    return res.data;
}

export async function createShift(dto: CreateShiftDto) {
    const res = await api.post("/Shifts", dto);
    return res.data;
}

export async function updateShift(id: number, dto: UpdateShiftDto) {
    const res = await api.patch("/Shifts/" + id, dto);
    return res.data;
}

export async function deleteShift(id: number) {
    const res = await api.delete("/Shifts/" + id);
    return res.data;
}