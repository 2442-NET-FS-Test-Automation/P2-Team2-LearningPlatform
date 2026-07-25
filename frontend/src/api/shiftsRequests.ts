import type { CreateShiftDto, UpdateShiftDto } from "../lib/types";
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

export async function createShift(dto: CreateShiftDto) {
    const res = await api.post("/Shifts", {params: {name: dto.name, startTime: dto.startTime, endTime: dto.endTime}});
    return res.data;
}

export async function updateShift(id: number, dto: UpdateShiftDto) {
    const res = await api.patch("/Shifts/"+id, dto);
    return res.data;
}