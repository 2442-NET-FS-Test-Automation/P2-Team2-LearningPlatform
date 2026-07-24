import { useEffect, useMemo, useState } from "react";
import CourseCard from "../../components/CourseCard";
import PaginationControls from "../../components/layout/PaginationControls";
import type { CourseCompact } from "../../lib/types";
import { getEnabledCourses } from "../../api/coursesRequests";

export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseCompact[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Get Courses from the API    
    useEffect(() => {
        setIsLoading(true);
        getEnabledCourses(currentPage, itemsPerPage, searchTerm.trim()).then((res) => {
            setCourses(res.items);
            setTotalPages(res.totalPages);
        })
        .catch((e) => {
            setError(e.message)
        })
        .finally (() => {
            setIsLoading(false);
        });
    }, [currentPage])

    useEffect(() => {
        getEnabledCourses(currentPage, itemsPerPage, searchTerm.trim()).then((res) => {
            setCourses(res.items);
            setTotalPages(res.totalPages);
        })
        .catch((e: Error) => {
            console.log(e)
            setError(e.message)
        })
        .finally (() => {
            setIsLoading(false);
        });
    }, [itemsPerPage, searchTerm])

    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);
    
    // Pagination handlers
    const handlePrevious = () => {setCurrentPage((prev) => Math.max(prev - 1, 1))};
    const handleNext = () => {setCurrentPage((prev) => Math.min(prev + 1, totalPages))};
    const goToPage = (pagenum: number) => {setCurrentPage(Math.min(Math.max(pagenum, 1), totalPages))};

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
                {isLoading ? (
                    <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
                        Loading...
                    </p>
                ) : (
                    error ? (
                        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
                            {error}
                        </p>
                    ) : (
                        courses.length > 0 ? (
                            <div className="card-grid py-8 px-8">
                                {courses.map(c => <CourseCard key={c.id} Id={c.id} Name={c.name} Description={c.description} CategoryName={c.category}/>) }
                            </div>
                        ) : (
                            <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
                                No course matches the search.
                            </p>
                        )
                    )
                )}
                
                {!isLoading && !error && (
                    <PaginationControls
                        totalPages={totalPages} 
                        currentPage={currentPage} 
                        goToPage={goToPage} 
                        handlePrevious={handlePrevious} 
                        handleNext={handleNext} 
                        setItemsPerPage={setItemsPerPage} 
                    />
                )}
            </div>
        </div>
    );
}