import { api } from "./api";

export async function isStudentEnrolled(userId: number, courseId: number) {
    const result = await api.get(`/Students/${userId}/Courses/${courseId}`);
    console.log(result)
    return { status: result.status, data: result.data };
}

export async function studentEnroll(userId: number, courseId: number){
    const result = await api.post("/Students/Enroll", null, { params: { userId, courseId }});
    return { status: result.status, data: result.data};
}

// export async function studentUnenroll(studentId: number, courseId: number) {

// }

export async function studentCourses(studentId: number){
    const result = await api.get("/Students/"+studentId+"/Courses");
    console.log(result);
    return result.data;
}

