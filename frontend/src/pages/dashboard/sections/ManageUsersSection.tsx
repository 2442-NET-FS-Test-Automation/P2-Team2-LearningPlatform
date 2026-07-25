import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash } from "lucide-react";

import CreateUserModal from "../../../components/modals/CreateUserModal";

import type { UserDto, UserRole } from "../../../lib/types";
import { getUsers, deactivateUser } from "../../../api/usersRequest";
import PaginationControls from "../../../components/layout/PaginationControls";

export default function ManageUsersSection() {
    const [users, setUsers] = useState<UserDto[]>([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [created, setCreated] = useState(false);

    // Get Courses from the API    
    useEffect(() => {
        //setLoading(true);

        getUsers(currentPage, itemsPerPage, search, roleFilter == "All" ? null : roleFilter, isActiveFilter)
            .then((res) => {
                setUsers(res.items);
                setTotalPages(res.totalPages);
            })
            .catch((e) => {
                setError(e.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentPage, roleFilter, itemsPerPage, created, search, isActiveFilter])

    useMemo(() => {
        setCurrentPage(1);
    }, [search, itemsPerPage]);

    // Pagination handlers
    const handlePrevious = () => {setCurrentPage((prev) => Math.max(prev - 1, 1))};
    const handleNext = () => {setCurrentPage((prev) => Math.min(prev + 1, totalPages))};
    const goToPage = (pagenum: number) => {setCurrentPage(Math.min(Math.max(pagenum, 1), totalPages))};
    const handleDeactivateUser = async (id: number) => {
    const confirmed = window.confirm(
            "Are you sure you want to deactivate this user?"
        );

        if (!confirmed) return;

        try {
            await deactivateUser(id);

            // recargar la lista
            setCreated(c => !c);
        }
        catch {
            alert("Couldn't deactivate user.");
        }
    };

    return (
        <>
            <div className="flex flex-col card dashboard-section space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold">
                        Manage Users
                    </h2>

                    <button
                        className="btn-primary flex items-center gap-2"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={18} /> Add User
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
                            placeholder="Search by name or username..."
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
                        Loading users...
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-slate-500 dark:text-slate-400">
                                    <th className="py-3">Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>
                                        <div className="flex items-center">
                                            <p className="mx-2">Role</p>
                                            
                                            <select
                                                onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}
                                                className="p-2 w-22 text-xs form-input"
                                                defaultValue={"All"}
                                            >
                                                <option value="All">All</option>
                                                <option value="Student">Student</option>
                                                <option value="Professor">Professor</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </th>
                                    <th className="text-right pr-3">
                                        Actions{" "}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 ? (
                                <p className="text-muted">
                                    No users found.
                                </p>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="py-3">{user.username}</td>
                                            <td>{user.firstName}{" "}{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className="blue-accent-chip rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="btn-outline p-2" >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button className="btn-outline p-2 mr-3 text-red-500/80 border-red-500/70"
                                                        onClick={() => handleDeactivateUser(user.id)} >
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
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {setCreated((c) => !c)}}
                />
            )}
        </>
    );
}