import type { ReactNode } from "react";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type UserRole = "Anonymous" | "Student" | "Professor" | "Admin";

export type CourseCardProps = {
    Id: number,
    Name: string,
    Description: string,
    CategoryName: string
}

export type CourseDetails = {
    Id: number,
    Name: string,
    CategoryName: string,
    Description: string,
    About: string,
    Instructor: string,
    Price: number,
    Hours?: number,
    Certificate: boolean,
    Enrolled: number,
    Schedule?: CourseSchedule[]
}

export type CourseSchedule = {
    Day: number,
    StartTime: string,
    EndTime: string
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

export type DashboardSideNavProps = {
    Tabs: TabItem[];
    ActiveTab: string;
    OnTabChange: (tabId: string) => void;
    OnLogout?: () => void;
    ClassName?: string;
}

export type EventBoxProps = {
    Event: ScheduleEvent;
    HOUR_START: number;
    HOUR_HEIGHT: number;
};

export type UserInfo = {
    Name: string,
    Email: string,
    Username: string,
    Role: UserRole
}

export type StudentCourseInfo = {
    Id: number,
    Name: string,
    Grade?: number,
    Completed: boolean,
    Schedule?: CourseSchedule[]
}

export type StudentCoursesInfo = {
    courses: StudentCourseInfo[]
}

export interface StudentInfo extends UserInfo {
    Bio?: string,
    Courses: StudentCourseInfo[]
}

export type StudentPartialInfo = Partial<StudentInfo>

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