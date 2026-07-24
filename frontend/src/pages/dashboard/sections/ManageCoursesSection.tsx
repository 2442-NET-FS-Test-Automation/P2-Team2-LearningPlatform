import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import { COURSE_CATEGORIES, type CourseCategory } from "../../../lib/types";

export default function ManageUsersSection() {
    const [courses, setCourses] = useState<[]>([]); // TODO: Specify type
    const [filteredCourses, setFilteredCourses] = useState<[]>([]); // TODO: Specify type
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CourseCategory | "All">("All");

    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    async function loadCourses() {
        setLoading(true);

        try {
            const response = await getCourses();

            setCourses(response.items);
            setFilteredCourses(response.items);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        let result = courses;

        if (categoryFilter !== "All") {
            result = result.filter((u) => u.category === categoryFilter);
        }

        if (search.trim() !== "") {
            const value = search.toLowerCase();
            result = result.filter((u) => u.name.toLowerCase().includes(value));
        }
        setFilteredCourses(result);

    }, [search, categoryFilter, courses]);

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
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as CourseCategory | "All")}
                        className="form-input sm:w-48"
                        defaultValue={"All"}
                    >
                        <option value="All">All</option>
                        {COURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {loading ? (
                    <p className="text-muted">
                        Loading courses...
                    </p>
                ) : filteredCourses.length === 0 ? (
                    <p className="text-muted">
                        No courses found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-slate-500 dark:text-slate-400">
                                    <th className="py-3">Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* TODO: Map the courses once its done same style as ManageUsers*/}
                            </tbody>
                        </table>
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