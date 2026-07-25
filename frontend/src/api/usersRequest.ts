import {api} from "./api";
import type { UserDto, CreateUserDto, UpdateProfileDto, UserRole } from "../lib/types";

export async function getUsers(page = 1, pageSize = 10, search: string | null = null, role: UserRole = null) {
    try {
        const response = await api.get("/User", {
            params: { page, pageSize, fullName:search, role },
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

    const response = await api.post("/User", request);

    return response.data;
}

export async function updateUser(
    id: number,
    dto: UpdateProfileDto
): Promise<{ user: UserDto, token: string }>  {
    const response = await api.patch(`/User/${id}`, dto);
    return response.data;
}
