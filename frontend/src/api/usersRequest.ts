import {api} from "./api";
import type { UserDto, CreateUserDto } from "../lib/types";


export async function getUsers(page = 1, pageSize = 10) {
    console.log(api.defaults.baseURL);

    const response = await api.get("/User", {
        params: { page, pageSize },
    });

    return response.data;
}


export async function createUser(
    dto: CreateUserDto
): Promise<UserDto> {

    const roleMap = {
        Student: 2,
        Professor: 1,
        Admin: 3
    };

    const request = {
        ...dto,
        role: roleMap[dto.role],

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