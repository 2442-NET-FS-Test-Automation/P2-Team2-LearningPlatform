import { api } from "./api";

export async function getEnabledCourses(page: number = 1, pageSize: number = 6) {
    const result = await api.get("/Courses/enabled", {
        params: {
            page: page,
            pageSize: pageSize
        }
    });
    console.log("enabled")
    console.log(result.data)
    return result.data;
}

export async function getDisabledCourses(page: number = 1, pageSize: number = 6) {
    const result = await api.get("/Courses/disabled", {
        params: {
            page: page,
            pageSize: pageSize
        }
    })
    console.log("disabled")
    console.log(result.data)
    return result.data;
}

export async function getCourseDetails(id: number) {
    const result = await api.get("/Courses/"+id)
    console.log("details")
    console.log(result.data)
    return result.data;
}