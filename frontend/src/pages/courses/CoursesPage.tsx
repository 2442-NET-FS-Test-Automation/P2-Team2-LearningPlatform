import { useEffect, useMemo, useState } from "react";
import CourseCard from "../../components/CourseCard";
import PaginationControls from "../../components/layout/PaginationControls";
import type { CourseCompact } from "../../lib/types";
import { getEnabledCourses } from "../../api/coursesRequests";

export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseCompact[]>([]);
    const [totalCourses, setTotalCourses] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredCourses = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return courses;
        return courses.filter(
            (course) => course.name.toLowerCase().includes(search) || course.category.toLowerCase().includes(search)
        );
    }, [courses, searchTerm]);

    const totalPages = Math.ceil(totalCourses / itemsPerPage) || 1;

    useEffect(() => {
        getEnabledCourses(currentPage, itemsPerPage).then((res) => {
            setCourses(res.items);
            setTotalCourses(res.totalItems);
        });
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    const handlePrevious = () => { setCurrentPage((prev) => Math.max(prev - 1, 1)); };
    const handleNext = () => { setCurrentPage((prev) => Math.min(prev + 1, totalPages)); };
    const goToPage = (pagenum: number) => { setCurrentPage(Math.min(Math.max(pagenum, 1), totalPages)); };

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
                {filteredCourses.length > 0 ? (
                    <div className="card-grid py-8 px-8">
                        {filteredCourses.map(c => (
                            <CourseCard
                                key={c.id}
                                Id={c.id}
                                Name={c.name}
                                Description={c.description}
                                CategoryName={c.category}
                            />
                        ))}
                    </div>
                ) : (
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
