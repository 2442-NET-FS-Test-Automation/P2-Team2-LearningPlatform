import type { ActivityWithSubmission, ActivityWithSubmissions, CreateActivityDto } from "../lib/types";
import { api } from "./api";

// Student — actividades del curso donde está inscrito
export async function getStudentActivities(courseId: number): Promise<ActivityWithSubmission[]> {
    const result = await api.get(`/Activities/course/${courseId}`);
    return result.data.items;
}

// Professor / Admin — actividades de un curso con todas las submissions
export async function getCourseActivities(courseId: number): Promise<ActivityWithSubmissions[]> {
    const result = await api.get(`/Activities/course/${courseId}`);
    return result.data.items;
}

// Crear actividad (Profesor y Admin)
export async function createActivity(courseId: number, dto: CreateActivityDto): Promise<void> {
    await api.post("/Activities", {
        courseId,
        ...dto
    });
}

// Eliminar actividad (soft delete)
export async function deleteActivity(activityId: number): Promise<void> {
    await api.delete(`/Activities/${activityId}`);
}

export async function submitActivity(activityId: number, file: string): Promise<void> {
    await api.post(`/Activities/${activityId}/submissions`, { file });
}

export async function gradeSubmission(submissionId: number, score: number, feedback: string): Promise<void> {
    await api.patch(`/Activities/submissions/${submissionId}/grade`, { score, feedback });
}