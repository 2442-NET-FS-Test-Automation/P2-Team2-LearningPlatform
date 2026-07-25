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
        <div className="section-light relative overflow-hidden min-h-screen">
            {/* Ambient background accents, matching Hero */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-24 top-80 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-400/10" aria-hidden="true" />

            <div className="relative container-page py-16">

                {/* Title & SearchBar */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                        {categoryFilter === "All" ? (
                            <>Browse all <span className="text-blue-600 dark:text-blue-400">courses</span></>
                        ) : (
                            <>
                                <span className="text-blue-600 dark:text-blue-400">{categoryFilter}</span> courses
                            </>
                        )}
                    </h1>
                    <p className="mx-auto mt-3 max-w-lg text-muted">
                        Search our catalog or filter by category to find what fits you.
                    </p>
                </div>
                <div className="card mx-auto mt-10 flex max-w-4xl flex-col gap-3 p-4 sm:flex-row">
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
                        className="form-input sm:w-56 text-sm"
                        defaultValue={"All"}
                    >
                        <option value="All">All categories</option>
                        {COURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>



                {/* Course Grid */}
                {isLoading ? (
                    <div className="mt-16 flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent" />
                        <p>Loading courses...</p>
                    </div>
                ) : (
                    error ? (
                        <p className="mt-16 text-center text-slate-500 dark:text-slate-400">
                            {error}
                        </p>
                    ) : (
                        courses.length > 0 ? (
                            <div className="card-grid py-8">
                                {courses.map((c, i) => (
                                    <div
                                        key={c.id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                                    >
                                        <CourseCard Id={c.id} Name={c.name} Description={c.description} CategoryName={c.category} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-16 flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                                <p className="my-5">No course matches the search.</p>
                            </div>
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