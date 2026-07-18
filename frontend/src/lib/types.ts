export type UserRole = "Anonymous" | "Student" | "Professor" | "Admin";

export type CourseCardProps = {
    Id: number,
    Name: string,
    Description: string,
    CategoryName: string
}