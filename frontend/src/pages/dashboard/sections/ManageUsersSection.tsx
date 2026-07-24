import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash } from "lucide-react";

import CreateUserModal from "../../../components/modals/CreateUserModal";

import type { UserDto, UserRole } from "../../../lib/types";
import { getUsers } from "../../../api/usersRequest";

export default function ManageUsersSection() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserDto[]>([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");

    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    async function loadUsers() {
        setLoading(true);

        try {
            const response = await getUsers();

            setUsers(response.items);
            setFilteredUsers(response.items);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (roleFilter !== "All") {
            result = result.filter((u) => u.role === roleFilter);
        }

        if (search.trim() !== "") {
            const value = search.toLowerCase();
            result = result.filter(
                (u) =>
                    `${u.firstName} ${u.lastName}`.toLowerCase().includes(value) ||
                    u.username.toLowerCase().includes(value)
            );
        }
        setFilteredUsers(result);

    }, [search, roleFilter, users]);

    return (
        <>
            <div className="card space-y-6">
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
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}
                        className="form-input sm:w-48"
                        defaultValue={"All"}
                    >
                        <option value="All">All</option>
                        <option value="Student">Student</option>
                        <option value="Professor">Professor</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                {loading ? (
                    <p className="text-muted">
                        Loading users...
                    </p>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-muted">
                        No users found.
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
                                {filteredUsers.map((user) => (
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

                                                <button className="btn-outline p-2 text-red-500/80 border-red-500/70">
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={loadUsers}
                />
            )}
        </>
    );
}