import type { AdminReport } from "../lib/types";
import { api } from "./api";

export async function getGeneralReport(): Promise<AdminReport> {
    const response = await api.get<AdminReport>("/Reports/general");
    return response.data;
}
