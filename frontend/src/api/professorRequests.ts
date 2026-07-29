import { api } from "./api";

export async function getProfessorCourses(){
    var res = await api.get("/Professors/MyCourses");
    return res.data;
}

export async function getOwnShift(){
    var res = await api.get("Professors/Shift");
    return res.data;
}