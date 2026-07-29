import { api } from "./api";

export async function isStudentEnrolled(userId: number, courseId: number) {
    const result = await api.get(`/Students/${userId}/Courses/${courseId}`);
    return { status: result.status, data: result.data };
}

export async function studentEnroll(userId: number, courseId: number){
    const result = await api.post("/Students/Enroll", null, { params: { userId, courseId }});
    return { status: result.status, data: result.data};
}

export async function studentUnenroll(userId: number, courseId: number) {
    const result = await api.delete(`/Students/${userId}/Courses/${courseId}`);
    return result.status;
}

export async function getStudentCourses(userId: number){
    const result = await api.get("/Students/"+userId+"/Courses");
    return result.data;
}

export async function setCourseCompleted(userId: number, courseId: number) {
    const result = await api.post(`/Students/${userId}/Courses/${courseId}/complete`);
    return { status: result.status, data: result.data.error };
}