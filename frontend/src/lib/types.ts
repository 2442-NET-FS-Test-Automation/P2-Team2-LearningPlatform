import type { ReactNode } from "react";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type UserRole = null | "Student" | "Professor" | "Admin";

export const COURSE_CATEGORIES = [
    "Programming",
    "WebDevelopment",
    "MobileDevelopment",
    "DataScience",
    "ArtificialIntelligence",
    "Cybersecurity",
    "DatabaseSystems",
    "CloudComputing",
    "DevOps",
    "SoftwareEngineering",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Business",
    "Marketing",
    "Finance",
    "Entrepreneurship",
    "Design",
    "GraphicDesign",
    "UxUiDesign",
    "Languages",
    "Communication",
    "PersonalDevelopment",
    "ProjectManagement",
    "Other"
] as const;

export type CourseCategory = typeof COURSE_CATEGORIES[number];

export type CourseDetails = {
    id: number,
    name: string,
    category: CourseCategory,
    description: string,
    about: string,
    instructor: string,
    price: number,
    hours?: number,
    capacity: number,
    isActive: boolean,
    certification: boolean,
    enrolledStudents: number,
    schedule?: CourseSchedule[],
    completed?: boolean
}

export type CourseCompact = {
    id: number,
    name: string,
    description: string,
    category: CourseCategory,
    isFull: number
}

export type CourseSchedule = {
    day: number,
    startTime: string,
    endTime: string
}

export type CourseInfo = {
    id: number,
    name: string,
    schedule?: CourseSchedule[]
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
    grade?: number,
    completed: boolean
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
    isActive: boolean;
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

export interface CreateCourseDto {
    professorId: number;
    name: string;
    description: string;
    about: string;
    category: CourseCategory;
    price: number;
    hours: number;
    capacity: number;
    certification: boolean;
    isActive: boolean;
    schedule?: CourseSchedule[];
}

export type CourseDto = {
    id: number,
    name: string,
    description: string,
    about: string,
    category: CourseCategory,
    price: number,
    hours: number,
    capacity: number,
}

export type TopCourse = {
    courseId: number;
    courseName: string;
    enrollmentCount: number;
}

export type AdminReport = {
    totalCourses: number;
    totalStudents: number;
    totalEnrollments: number;
    topCourses: TopCourse[];
}

export interface UpdateProfileDto {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;

    role?: UserRole;

    // Student
    birthDate?: string;
    studentCourseIds?: number[];

    // Professor
    shiftId?: number;
    contractDate?: string;
    isActive?: boolean;
    professorCourseIds?: number[];
}

export type ShiftDto = {
    id: number,
    name: string,
    startTime: string,
    endTime: string,
    assignees: string | null
}

export type CreateShiftDto = Omit<ShiftDto, "id" | "assignees">;

export type UpdateShiftDto = Partial<CreateShiftDto>

export interface StudentInfoDto {
    birthDate?: string;
    courses: CourseSelectDto[];
}

export interface ProfessorInfoDto {
    id: number;
    contractDate?: string;
    shiftId?: number;
    isActive:boolean;
    courses:CourseSelectDto[];
}

export interface UserDetailsDto extends UserDto{
    student?:StudentInfoDto;
    professor?:ProfessorInfoDto;
}

export interface CourseSelectDto {
    id:number;
    name:string;
}

export type UpdateCourseDto = {
    name?: string;
    description?: string;
    about?: string;
    category?: CourseCategory;
    capacity?: number;
    price?: number;
    hours?: number;
    certification?: boolean;
    isActive?: boolean;
    schedule?: CourseSchedule[];
}

export type Activity = {
    id: number;
    courseId: number;
    createdBy: number;
    title: string;
    description: string;
    dueDate: string;   // ISO date string
    createdAt: string; // ISO date string
}

export type Submission = {
    id: number;
    activityId: number;
    studentId: number;
    studentName: string;
    file: string;
    feedback?: string;
    submittedAt: string;
    gradedAt?: string;
    score?: number;
}

// Student-facing view: one activity, at most one submission (their own)
export type ActivityWithSubmission = Activity & {
    submission?: Submission;
}

// Professor/Admin-facing view: one activity, all student submissions
export type ActivityWithSubmissions = Activity & {
    submissions: Submission[];
}

export type CreateActivityDto = {
    title: string;
    description: string;
    dueDate: string;
}
