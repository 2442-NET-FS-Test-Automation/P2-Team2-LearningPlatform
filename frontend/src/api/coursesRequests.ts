import type { CourseCategory, CourseDetails, CourseListDto, UpdateCourseDto } from "../lib/types";
import { api } from "./api";

export async function getAllCourses(page: number = 1, pageSize: number = 6, search: string | null = null, category: CourseCategory | null = null, isActiveFilter: boolean | null = null) {
    try { 
        const result = await api.get("/Courses", {
            params: {
                page: page,
                pageSize: pageSize,
                searchName: search,
                categoryFilter: category,
                isActiveFilter: isActiveFilter
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

export async function getCourseDetails(id: number) {
    try {
        const result = await api.get<CourseDetails>("/Courses/"+id)
        return result.data;
    } catch {
        throw Error("Timeout: API did not respond in time.")
    }
}

export async function getCoursesForSelect(): Promise<CourseListDto[]> {
    const response = await api.get("/Courses", {
        params: {
            page: 1,
            pageSize: 1000
        }
    });

    return response.data.items;
}

export async function updateCourse(id: number, data: UpdateCourseDto): Promise<void> {
    await api.patch(`/Courses/${id}`, data);
}

export async function deleteCourse(id: number): Promise<void> {
    await api.delete(`/Courses/${id}`);
}