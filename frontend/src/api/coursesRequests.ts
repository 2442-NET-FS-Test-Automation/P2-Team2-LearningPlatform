import type { CourseCategory, CourseDetails, CourseDto, CourseSelectDto, CreateCourseDto, UpdateCourseDto } from "../lib/types";
import { COURSE_CATEGORIES } from "../lib/types";
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
        return result.data.items;
    } catch {
        throw Error("Timeout: API did not respond in time.")
    }
}

export async function getEnabledCoursesPaged(
    page: number = 1,
    pageSize: number = 6,
    search: string | null = null,
    category: CourseCategory | null = null,
    isFull: number = 0
) {
    try {
        const result = await api.get("/Courses/enabled", {
            params: {
                page,
                pageSize,
                searchName: search,
                categoryFilter: category,
                isFull : isFull
            }
        });

        return result.data;
    } catch {
        throw Error("Timeout: API did not respond in time.");
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

export async function getCoursesForSelect(): Promise<CourseSelectDto[]> {
    const response = await api.get("/Courses", {
        params: {
            page: 1,
            pageSize: 1000
        }
    });

    return response.data.items;
}

export async function createCourse(dto: CreateCourseDto): Promise<CourseDto> {
    const categoryIndex = COURSE_CATEGORIES.indexOf(dto.category);

    const request = {
        professorId: dto.professorId,
        name: dto.name,
        description: dto.description,
        about: dto.about,
        category: categoryIndex >= 0 ? categoryIndex : dto.category,
        capacity: Number(dto.capacity) || 0,
        price: Number(dto.price) || 0,
        hours: Number(dto.hours) || 0,
        certification: Boolean(dto.certification),
    };

    const response = await api.post("/Courses", request);
    return response.data;
}

export async function updateCourse(id: number, data: UpdateCourseDto): Promise<void> {
    await api.patch(`/Courses/${id}`, data);
}

export async function deleteCourse(id: number): Promise<void> {
    await api.delete(`/Courses/${id}`);
}

export async function reactivateCourse(id: number): Promise<void> {
    await api.post(`/Courses/${id}/reactivate`);
}