import { useEffect, useMemo, useState } from "react";
import CourseCard from "../../components/CourseCard";
import PaginationControls from "../../components/layout/PaginationControls";
import { COURSE_CATEGORIES, type CourseCategory, type CourseCompact } from "../../lib/types";
import { getEnabledCourses } from "../../api/coursesRequests";
import { Search } from "lucide-react";

export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseCompact[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CourseCategory | "All">("All")
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Get Courses from the API    
    useEffect(() => {
        setIsLoading(true);
        getEnabledCourses(currentPage, itemsPerPage, 
            searchTerm.trim(), categoryFilter == "All" ? null : categoryFilter)
            .then((res) => {
                setCourses(res.items);
                setTotalPages(res.totalPages);
            })
            .catch((e) => {
                setError(e.message)
            })
            .finally (() => {
                setIsLoading(false);
            });
    }, [currentPage, categoryFilter])

    useEffect(() => {
        getEnabledCourses(currentPage, itemsPerPage, 
            searchTerm.trim(), categoryFilter == "All" ? null : categoryFilter)
            .then((res) => {
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
                    <h1 className="text-4xl font-extrabold leading-tight my-2">{categoryFilter} courses</h1>
                    
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Search by course name..."  
                                className="form-input pl-10 w-full"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as CourseCategory | "All")}
                            className="form-input sm:w-48 text-sm"
                            defaultValue={"All"}
                        >
                            <option value="All">All</option>
                            {COURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
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