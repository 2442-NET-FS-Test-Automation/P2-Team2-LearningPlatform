import { useMemo, useState } from "react";
import CourseCard from "../../components/CourseCard";
import type { CourseCardProps } from "../../lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CoursesPage() {
    const courses: CourseCardProps[] = [
        { Id: 1, Name: "Python Basics", Description: "A course about programming in Python", CategoryName: "Programming"},
        { Id: 2, Name: "React for web", Description: "", CategoryName: "WebDevelopment"},
        { Id: 3, Name: "Using Android Studio", Description: "", CategoryName: "MobileDevelopment"},
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

    // Search functions
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCourses = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return courses;
        return courses.filter(
            (course) => course.Name.toLowerCase().includes(search) || course.CategoryName.toLowerCase().includes(search)
        )
    }, [courses, searchTerm]);

    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const firstIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = filteredCourses.slice(firstIndex, firstIndex+itemsPerPage);

    // Pagination handlers
    const handlePrevious = () => {setCurrentPage((prev) => Math.max(prev - 1, 1))};
    const handleNext = () => {setCurrentPage((prev) => Math.min(prev + 1, totalPages))};
    const goToPage = (pagenum: number) => {setCurrentPage(Math.min(Math.max(pagenum, 1), totalPages))};

    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="flex-grow w-full max-w-7xl mx-auto py-10 px-10 ">
                {/* Title & SearchBar */}
                <div>
                    <h1 className="text-4xl font-extrabold leading-tight dark:text-white">All courses</h1>
                    <input type="text" className="form-input mt-3" placeholder="Search courses"
                        value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                {/* Course Grid */}
                {paginatedCourses.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-3 py-8 px-8">
                        { paginatedCourses.map(c => <CourseCard key={c.Id} Id={c.Id} Name={c.Name} Description={c.Description} CategoryName={c.CategoryName}/>) }
                    </div>
                ): (
                    <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
                        No course matches the search.
                    </p>
                )}
                {/* Pagination Controls */}
                <div className="grid grid-cols-3">
                    {totalPages > 1 && (
                        <div className="flex w-full mx-auto justify-center col-2">
                            <button onClick={handlePrevious} disabled={currentPage === 1}
                                className="btn-primary rounded-full mx-2 px-2.5">
                                <ChevronLeft />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`rounded-full px-4.5 py-0 text-sm font-medium border-none mx-1 ${page === currentPage
                                    ? "btn-primary"
                                    : "hover:bg-slate-200 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                                }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button onClick={handleNext} disabled={currentPage === totalPages}
                                className="btn-primary rounded-full mx-2 px-2.5">
                                <ChevronRight />
                            </button>
                        </div>
                        
                    )}
                    {/* Items Per Page Selector */}
                    <div className="my-auto mx-auto col-3">
                        <label htmlFor="itemsperpage">Per Page: </label>
                        <select value={12}
                            name="itemsperpage" id="itemsperpage" 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                            <option value="6">6</option>
                            <option value="12">12</option>
                            <option value="18">18</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}