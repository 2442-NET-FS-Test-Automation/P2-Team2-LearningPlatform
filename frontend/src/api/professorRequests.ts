import type { CourseInfo, ShiftDto, ProfessorSummary } from "../lib/types";
import { api } from "./api";

export async function getProfessorCourses(): Promise<CourseInfo[]> {
    var res = await api.get("/Professors/MyCourses");
    return res.data;
}

export async function getOwnShift(): Promise<ShiftDto | null> {
    const res = await api.get('/Professors/Shift');
    return res.data;
}

export async function getProfessorSummary(): Promise<ProfessorSummary> {
    const res = await api.get('/Professors/Summary');
    return res.data;
}