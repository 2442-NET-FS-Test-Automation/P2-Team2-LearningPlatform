import {api} from "./api";
import type { UserDto, CreateUserDto, UpdateProfileDto, UserRole } from "../lib/types";

export async function getUsers(page = 1, pageSize = 10, search: string | null = null, role: UserRole = null, isActive: boolean | null = null) {
    try {
        const response = await api.get("/Users", {
            params: { page, pageSize, fullName:search, role, isActive },
        });
        return response.data;
    } catch {
        throw Error("Timeout: API did not respond in time.")
    }
}

export async function createUser(
    dto: CreateUserDto
): Promise<UserDto> {

    const request = {
        ...dto,

        birthDate:
            dto.role === "Student"
                ? dto.birthDate
                : null,

        shiftId:
            dto.role === "Professor"
                ? dto.shiftId
                : null,

        contractDate:
            dto.role === "Professor"
                ? dto.contractDate
                : null
    };

    const response = await api.post("/Users", request);

    return response.data;
}

export async function updateUser(
    id: number,
    dto: UpdateProfileDto
): Promise<{ user: UserDto, token: string }> {

    const response = await api.patch(`/Users/${id}`, dto);

    return response.data;
}

export async function deactivateUser(id: number): Promise<void> {
    await api.delete(`/Users/${id}`);
}

export async function reactivateUser(id: number): Promise<void> {
    await api.post(`/Users/${id}/reactivate`);
}

export async function promoteToProfessor(
    id: number,
    dto: {
        shiftId: number;
        contractDate: string;
    }
) {
    await api.post(`/Users/${id}/promote`, dto);
}

export async function getUser(id: number) {
    const response = await api.get(`/Users/${id}`);
    return response.data;
}