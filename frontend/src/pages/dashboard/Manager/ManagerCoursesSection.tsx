import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Search, Trash } from "lucide-react";

import CreateCourseModal from "../../../components/modals/CreateCourseModal";
import PaginationControls from "../../../components/layout/PaginationControls";
import EditCourseModal from "../../../components/modals/EditCourseModal";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import Loading from "../../../components/layout/Loading";

import { getAllCourses, deleteCourse } from "../../../api/coursesRequests";
import { COURSE_CATEGORIES, type CourseCategory, type CourseDetails } from "../../../lib/types";

export default function ManageUsersSection() {
    const [courses, setCourses] = useState<CourseDetails[]>([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CourseCategory | "All">("All");
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [created, setCreated] = useState(false);

    const [editCourseId, setEditCourseId] = useState<number | null>(null);
    const [deleteCourseId, setDeleteCourseId] = useState<number | null>(null);

    const handleDelete = async () => {
        if (!deleteCourseId) return;
        try {
            await deleteCourse(deleteCourseId);
            setCreated(!created);
        } catch (e: any) {
            setError(e.message || "Failed to delete course.");
        } finally {
            setDeleteCourseId(null);
        }
    };

    useEffect(() => {
        getAllCourses(currentPage, itemsPerPage, search, categoryFilter == "All" ? null : categoryFilter, isActiveFilter)
            .then((res) => {
                setCourses(res.items);
                setTotalPages(res.totalPages);
            })
            .catch((e) => {
                setError(e);
            });
    }, [currentPage, itemsPerPage, categoryFilter, isActiveFilter, created, search]);

    useEffect(() => {
        setLoading(true);
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
    }, []);

    useMemo(() => {
        setCurrentPage(1);
    }, [search, itemsPerPage, created]);

    const handlePrevious = () => { setCurrentPage((prev) => Math.max(prev - 1, 1)) };
    const handleNext = () => { setCurrentPage((prev) => Math.min(prev + 1, totalPages)) };
    const goToPage = (pagenum: number) => { setCurrentPage(Math.min(Math.max(pagenum, 1), totalPages)) };

    return(
        <>
            <div className="flex flex-col card dashboard-section space-y-6">
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

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Loading fullh={false} message="Loading Courses..." />
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
                                            >
                                                <option value="All">All</option>
                                                {COURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th className="text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {courses.length === 0 ? (
                                    <tr>
                                        <td className="text-muted" colSpan={5}>
                                            No courses found.
                                        </td>
                                    </tr>
                                ) : (
                                    courses.map((c) => (
                                        < tr
                                            key = { c.id }
                                            className = "border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="py-3">
                                                <Link to={`/courses/${c.id}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                                                    {c.name}
                                                </Link>
                                            </td>
                                            <td className="py-3">
                                                <span className="blue-accent-chip rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                                    {c.category}
                                                </span>
                                            </td>
                                            <td className="py-3">{c.price}</td>
                                            <td className="py-3">
                                                {c.isActive ? (
                                                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                                                ) : (
                                                    <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-xs font-medium">Inactive</span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditCourseId(c.id)} className="btn-outline p-2" >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button onClick={() => setDeleteCourseId(c.id)} className="btn-outline p-2 mr-3 text-red-500/80 border-red-500/70">
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
                            defaultIPP={itemsPerPage}
                            goToPage={goToPage}
                            handlePrevious={handlePrevious}
                            handleNext={handleNext}
                            setItemsPerPage={setItemsPerPage}
                        />
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateCourseModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setCreated((c) => !c);
                    }}
                />
            )}

            {editCourseId && (
                <EditCourseModal
                    courseId={editCourseId}
                    onClose={() => setEditCourseId(null)}
                    onUpdated={() => {
                        setEditCourseId(null);
                        setCreated(!created);
                    }}
                />
            )}

            {deleteCourseId && (
                <ConfirmModal
                    title="Delete Course"
                    message="Are you sure you want to delete this course? This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteCourseId(null)}
                />
            )}
        </>
    );
}