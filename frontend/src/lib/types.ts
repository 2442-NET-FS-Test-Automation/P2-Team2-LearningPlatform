import type { ReactNode } from "react";

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
    Enrolled: number
}

export type UserCourseInfo = {
    Id: number,
    Name: string,
    Grade?: number,
    Completed: boolean
}

export type UserCoursesInfo = {
    courses: UserCourseInfo[]
}

export type UserStats = {
    TotalCourses: number,
    Completed: number,
    AvgGrade: number,
}
export type UserPartialInfo = Partial<UserInfo>;

export type UserInfo = {
    Name: string,
    Email: string,
    Username: string,
    Role: UserRole,
    Bio?: string,
    Courses: UserCourseInfo[]
}

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