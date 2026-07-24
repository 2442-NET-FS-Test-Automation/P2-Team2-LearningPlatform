import type { CourseCategory, CourseDetails } from "../lib/types";
import { api } from "./api";

export async function getAllCourses(page: number = 1, pageSize: number = 6, search: string | null = null, category: CourseCategory | null = null) {
    try { 
        const result = await api.get("/Courses", {
            params: {
                page: page,
                pageSize: pageSize,
                searchName: search,
                categoryFilter: category
            }
        });
        return result.data;
    } catch {
        throw Error("Timeout: API did not respond in time.")
    }
}

export async function getEnabledCourses(page: number = 1, pageSize: number = 6, search: string | null = null, category: CourseCategory | null = null) {
    try { 
        const result = await api.get("/Courses/enabled", {
            params: {
                page: page,
                pageSize: pageSize,
                searchName: search,
                categoryFilter: category
            }
        });
        return result.data;
    } catch {
        throw Error("Timeout: API did not respond in time.")
    }
}

export async function getDisabledCourses(page: number = 1, pageSize: number = 6, search: string | null = null, category: CourseCategory | null = null) {
    try {
        const result = await api.get("/Courses/disabled", {
            params: {
                page: page,
                pageSize: pageSize,
                searchName: search,
                categoryFilter: category
            }
        })
        return result.data;
    } catch {
        throw Error("Timeout: API did not respond in time.")
    }
}

export async function getCourseDetails(id: number) {
    try {
        const result = await api.get<CourseDetails>("/Courses/"+id)
        return result.data;
    } catch {
        throw Error("Timeout: API did not respond in time.")
    }
}