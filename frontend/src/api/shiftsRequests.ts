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
    console.log("dto", dto)
    const res = await api.post("/Shifts", dto);
    return res.data;
}

export async function updateShift(id: number, dto: UpdateShiftDto) {
    const res = await api.patch("/Shifts/" + id, null, { params: { Name: dto.name, StartTime: dto.startTime, EndTime: dto.endTime } });
    return res.data;
}