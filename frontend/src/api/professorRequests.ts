import { api } from "./api";

export async function getProfessorCourses(){
    var res = await api.get("/Professors/MyCourses");
    return res.data;
}