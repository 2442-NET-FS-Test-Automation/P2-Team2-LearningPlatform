import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash } from "lucide-react";

import { COURSE_CATEGORIES, type CourseCategory, type CourseDetails } from "../../../lib/types";
import { getAllCourses } from "../../../api/coursesRequests";
import PaginationControls from "../../../components/layout/PaginationControls";

export default function ManageUsersSection() {
    const [courses, setCourses] = useState<CourseDetails[]>([]); // TODO: Specify type
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CourseCategory | "All">("All");
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [created, setCreated] = useState(false);

    useEffect(() => {
        getAllCourses(currentPage, itemsPerPage, search, categoryFilter == "All" ? null : categoryFilter, isActiveFilter)
            .then((res) => {
                setCourses(res.items);
                setTotalPages(res.totalPages);
            })
            .catch((e) => {
                setError(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentPage, itemsPerPage, categoryFilter, isActiveFilter, created, search]);

    useMemo(() => {
        setCurrentPage(1);
    }, [search, itemsPerPage, created]);

    const handlePrevious = () => { setCurrentPage((prev) => Math.max(prev - 1, 1)) };
    const handleNext = () => { setCurrentPage((prev) => Math.min(prev + 1, totalPages)) };
    const goToPage = (pagenum: number) => { setCurrentPage(Math.min(Math.max(pagenum, 1), totalPages)) };

    return(
        <>
            <div className="card space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold">
                        Manage Courses
                    </h2>

                    <button
                        className="btn-primary flex items-center gap-2"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={18} /> Add Course
                    </button>
                </div>

                {/* Search + role filter */}
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        onChange={(e) => setIsActiveFilter(e.target.value === "All" ? null : (e.target.value === "Active" ? true : false))}
                        className="form-input sm:w-48"
                        defaultValue={"All"}
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {loading ? (
                    <p className="text-muted">
                        Loading courses...
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-slate-500 dark:text-slate-400">
                                    <th className="py-3">Name</th>
                                    <th>
                                        <div className="flex items-center">
                                            <p className="mx-2">Category</p>
                                            
                                            <select
                                                value={categoryFilter}
                                                onChange={(e) => setCategoryFilter(e.target.value as CourseCategory | "All")}
                                                    className="p-2 w-22 text-xs form-input"
                                                defaultValue={"All"}
                                            >
                                                <option value="All">All</option>
                                                {COURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </th>
                                    <th>Price</th>
                                    <th className="text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {courses.length === 0 ? (
                                <p className="text-muted">
                                    No courses found.
                                </p>) :
                                (
                                    courses.map((c) => (
                                        < tr
                                            key = { c.id }
                                            className = "border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="py-3">{c.name}</td>
                                            <td className="py-3">
                                                <span className="blue-accent-chip rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                                    {c.category}
                                                </span>
                                            </td>
                                            <td className="py-3">{c.price}</td>
                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="btn-outline p-2" >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button className="btn-outline p-2 mr-3 text-red-500/80 border-red-500/70">
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && !error && (
                    <div className="mt-auto">
                        <PaginationControls
                            totalPages={totalPages}
                            currentPage={currentPage}
                            goToPage={goToPage}
                            handlePrevious={handlePrevious}
                            handleNext={handleNext}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                )}
            </div>

            {showCreateModal && (
                <></> // TODO: Make the CreateCourseModal
                // <CreateUserModal
                //     onClose={() => setShowCreateModal(false)}
                //     onCreated={loadUsers}
                // />
            )}
        </>
    );
}