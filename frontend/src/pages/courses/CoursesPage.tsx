import CourseCard from "../../components/CourseCard";
import type { CourseCardProps } from "../../lib/types";

export default function CoursesPage() {
    const courses: CourseCardProps[] = [
        { Id: 1, Name: "Python Basics", Description: "A course about programming in Python", CategoryName: "Programming"},
        { Id: 2, Name: "", Description: "", CategoryName: "WebDevelopment"},
        { Id: 3, Name: "", Description: "", CategoryName: "MobileDevelopment"},
        { Id: 4, Name: "", Description: "", CategoryName: "DataScience"},
        { Id: 5, Name: "", Description: "", CategoryName: "ArtificialIntelligence"},
        { Id: 6, Name: "", Description: "", CategoryName: "Cybersecurity"},
        { Id: 7, Name: "", Description: "", CategoryName: "DatabaseSystems"},
        { Id: 8, Name: "", Description: "", CategoryName: "CloudComputing"},
        { Id: 9, Name: "", Description: "", CategoryName: "DevOps"},
        { Id: 10, Name: "", Description: "", CategoryName: "SoftwareEngineering"},
        { Id: 11, Name: "", Description: "", CategoryName: "Mathematics"},
        { Id: 12, Name: "", Description: "", CategoryName: "Physics"},
        { Id: 13, Name: "", Description: "", CategoryName: "Chemistry"},
        { Id: 14, Name: "", Description: "", CategoryName: "Biology"},
        { Id: 15, Name: "", Description: "", CategoryName: "Business"},
        { Id: 16, Name: "", Description: "", CategoryName: "Marketing"},
        { Id: 17, Name: "", Description: "", CategoryName: "Finance"},
        { Id: 18, Name: "", Description: "", CategoryName: "Entrepreneurship"},
        { Id: 19, Name: "", Description: "", CategoryName: "Design"},
        { Id: 20, Name: "", Description: "", CategoryName: "GraphicDesign"},
        { Id: 21, Name: "", Description: "", CategoryName: "UxUiDesign"},
        { Id: 22, Name: "", Description: "", CategoryName: "Languages"},
        { Id: 23, Name: "", Description: "", CategoryName: "Communication"},
        { Id: 24, Name: "", Description: "", CategoryName: "PersonalDevelopment"},
        { Id: 25, Name: "", Description: "", CategoryName: "ProjectManagement"},
        { Id: 26, Name: "", Description: "", CategoryName: "Other"},
        { Id: 27, Name: "", Description: "", CategoryName: "DatabaseSystems"},
        { Id: 28, Name: "", Description: "", CategoryName: "ArtificialIntelligence"},
        { Id: 29, Name: "", Description: "", CategoryName: "Design"},
        { Id: 30, Name: "", Description: "", CategoryName: "Cybersecurity"},
        { Id: 31, Name: "", Description: "", CategoryName: "Programming"},
        { Id: 32, Name: "", Description: "", CategoryName: "PersonalDevelopment"}
    ];
    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="grid gap-8 md:grid-cols-4 py-20 mx-auto px-8">
                { courses.map(c => <CourseCard Id={c.Id} Name={c.Name} Description={c.Description} CategoryName={c.CategoryName}/>) }
            </div>
        </div>
    );
}