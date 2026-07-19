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