import { DAY_NAMES, DAY_NAMES_SHORT, type CourseSchedule, type UserRole } from "./types";

export function handleLogout() {
    console.log("Logging out...");
};

export function getDashboardRoute(role: UserRole): string {
    switch (role) {
        case "Student": return "/student/dashboard";
        case "Professor": return "/professor/dashboard";
        case "Admin": return "/manager/dashboard";
        default: return "/";
    }
}

export function getGradeColor(grade: number): string {
    if (grade >= 80) return 'text-green-600 dark:text-green-400';
    if (grade >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
};

export function calculateAverage(array: number[]): number {
    if (array.length === 0) return 0; // Prevent NaN on empty array

    const total = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return total / array.length;
}

export function getDayName(day: number, short: boolean = false): string {
    if (short) return DAY_NAMES_SHORT[day] ?? "Unknown";
    return DAY_NAMES[day] ?? "Unknown";
}

export function formatSchedule(schedule: CourseSchedule[]): string {
    return schedule
        .map(s => `${getDayName(s.day, true)} ${s.startTime}-${s.endTime}`)
        .join(", ");
}

export function minutesFromMidnight(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + (m || 0);
}

export function timeToHours(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h + (m || 0) / 60;
}

export function isAlphanumeric(text: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(text);
}

export function isBirthDateValid(birthDate: string): boolean {
    const birthDateMs: number = Date.parse(birthDate);
    const minDate: Date = new Date();
    minDate.setFullYear(minDate.getFullYear() - 12);

    if (birthDateMs > minDate.getTime()) return false;
    return true;
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
    const startSeconds = parseTimeToSeconds(startTime);
    const endSeconds = parseTimeToSeconds(endTime);

    // If either parsing failed, the range is invalid
    if (startSeconds === null || endSeconds === null) {
        return false;
    }

    // Start must be before or equal to end (same day)
    if (startSeconds > endSeconds) {
        return false;
    }

    // Gap must be at least one hour (3600 seconds)
    return (endSeconds - startSeconds) >= 3600;
}

function parseTimeToSeconds(timeStr: string): number | null {
    const parts = timeStr.split(':').map(Number);
    if (parts.length < 2 || parts.length > 3) {
        return null;
    }

    const [hours, minutes, seconds = 0] = parts;
    if (
        isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59 ||
        seconds < 0 || seconds > 59
    ) {
        return null;
    }

    return hours * 3600 + minutes * 60 + seconds;
}

export function getApiError(err: unknown): string{
    if(err && typeof err === "object" && "response" in err){
        const axiosErr = err as {response?: {data?:{errors?: Record<string, string[]>, title?: string}}};
        const errors = axiosErr.response?.data?.errors;
        if(errors){
            return Object.values(errors)[0]?.[0] ?? "Validation error";

        } else{
            return axiosErr.response?.data?.title ?? "Something went wrong";
        }
    }
    else{
        return "Something went wrong";
    }
}