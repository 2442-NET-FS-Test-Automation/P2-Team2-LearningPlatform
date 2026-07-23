import type { ReactNode } from "react";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type UserRole = "Anonymous" | "Student" | "Professor" | "Admin";

export type CourseDetails = {
    id: number,
    name: string,
    category: string,
    description: string,
    about: string,
    instructor: string,
    price: number,
    hours?: number,
    certification: boolean,
    enrolledStudents: number,
    schedule?: CourseSchedule[]
}

export type CourseCompact = {
    id: number,
    name: string,
    description: string,
    category: string
}

export type CourseSchedule = {
    day: number,
    startTime: string,
    endTime: string
}

export type CourseInfo = {
    Id: number,
    Name: string,
    Schedule?: CourseSchedule[]
}

export type CoursesInfo = {
    Courses: CourseInfo[];
}

export type CourseScheduleListProps = {
    Schedule?: CourseSchedule[];
};

export type ScheduleEvent = CourseSchedule & { CourseName: string; ColorClass: string };

export type TabItem = {
    Id: string;
    Label: string;
    Icon: ReactNode;
}

export type UserInfo = {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    role: UserRole,
    bio?: string
}

export interface StudentCourseInfo extends CourseInfo {
    Grade?: number,
    Completed: boolean
}

export type StudentCoursesInfo = {
    courses: StudentCourseInfo[]
}

export interface StudentInfo extends UserInfo {
    Courses: StudentCourseInfo[]
}

export type StudentStats = {
    TotalCourses: number,
    Completed: number,
    AvgGrade: number,
}

export type Shift = {
    Name: string,
    StartTime: string,
    EndTime: string
}

export interface ProfessorInfo extends UserInfo {
    Shift: Shift,
    ContractDate: string,
    IsActive: boolean
}
export interface UserDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    role: UserRole;
}

export interface CreateUserDto {
    username: string;
    password: string;

    firstName: string;
    lastName: string;
    email: string;
    bio: string;

    role: UserRole;

    // Student
    birthDate?: string;

    // Professor
    shiftId?: number;
    contractDate?: string;
}
