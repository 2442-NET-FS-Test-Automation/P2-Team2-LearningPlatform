import { useEffect, useMemo, useState } from "react";
import CourseCard from "../../components/CourseCard";
import PaginationControls from "../../components/layout/PaginationControls";
import type { CourseCompact } from "../../lib/types";
import { getEnabledCourses } from "../../api/coursesRequests";

export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseCompact[]>([]);

    // Search functions
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCourses = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return courses;
        return courses.filter(
            (course) => course.name.toLowerCase().includes(search) || course.category.toLowerCase().includes(search)
        )
    }, [courses, searchTerm]);
    
    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState(6);
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

    useEffect(() => {
        getEnabledCourses().then((res) => {
            setCourses(res.items)
        })
    }, [])

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="flex-grow w-full container-page py-10 ">
                {/* Title & SearchBar */}
                <div>
                    <h1 className="text-4xl font-extrabold leading-tight">All courses</h1>
                    <input type="text" className="form-input mt-3" placeholder="Search courses"
                        value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                {/* Course Grid */}
                {paginatedCourses.length > 0 ? (
                    <div className="card-grid py-8 px-8">
                        { paginatedCourses.map(c => <CourseCard key={c.id} Id={c.id} Name={c.name} Description={c.description} CategoryName={c.category}/>) }
                    </div>
                ): (
                    <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
                        No course matches the search.
                    </p>
                )}

                <PaginationControls
                    totalPages={totalPages} 
                    currentPage={currentPage} 
                    goToPage={goToPage} 
                    handlePrevious={handlePrevious} 
                    handleNext={handleNext} 
                    setItemsPerPage={setItemsPerPage} 
                />
            </div>
        </div>
    );
}