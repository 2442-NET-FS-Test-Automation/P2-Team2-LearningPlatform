import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import type { UserDto } from "../../../lib/types";
import CreateUserModal from "../../../components/modals/CreateUserModal";
import { getUsers } from "../../../api/usersRequest";

export default function ManageUsersSection() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserDto[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    
    async function loadUsers() {

        setLoading(true);

        try {

            const response = await getUsers();
            
            console.log(response);

            setUsers(response.items);
            setFilteredUsers(response.items);

        }
        finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredUsers(users);
            return;
        }

        const value = search.toLowerCase();

        setFilteredUsers(
            users.filter(
                (u) =>
                    `${u.firstName} ${u.lastName}`
                        .toLowerCase()
                        .includes(value) ||
                    u.username.toLowerCase().includes(value)
            )
        );
    }, [search, users]);

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
                        <Plus size={18} />
                        Add User
                    </button>
                </div>

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-3 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search by name or username..."
                        className="input pl-10 w-full"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
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
                        <table className="w-full">
                            <thead className="border-b">
                                <tr className="text-left">
                                    <th className="py-3">
                                        Username
                                    </th>

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
                                        className="border-b"
                                    >
                                        <td className="py-3">
                                            {user.username}
                                        </td>

                                        <td>
                                            {user.firstName}{" "}
                                            {user.lastName}
                                        </td>

                                        <td>{user.email}</td>

                                        <td>{user.role}</td>

                                        <td className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="btn-outline">
                                                    <Pencil
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </button>

                                                <button className="btn-outline text-red-600">
                                                    <Trash2
                                                        size={
                                                            18
                                                        }
                                                    />
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
                    onClose={() =>
                        setShowCreateModal(false)
                    }
                    onCreated={loadUsers}
                />
            )}
        </>
    );
}