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