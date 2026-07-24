import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

export default function ManageShiftsSection() {
    const [shifts, setShifts] = useState<[]>([]); // TODO: Specify type
    const [filteredShifts, setFilteredShifts] = useState<[]>([]); // TODO: Specify type
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    async function loadShifts() {
            setLoading(true);
    
            try {
                const response = await getShifts();
    
                setShifts(response.items);
                setFilteredShifts(response.items);
            } finally {
                setLoading(false);
            }
        }
    
        useEffect(() => {
            loadShifts();
        }, []);
    
        useEffect(() => {
            let result = shifts;
    
            if (search.trim() !== "") {
                const value = search.toLowerCase();
                result = result.filter((u) => u.name.toLowerCase().includes(value));
            }
            setFilteredShifts(result);
    
        }, [search, shifts]);

    return (
        <>
            <div className="card space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold">
                        Manage Shifts
                    </h2>

                    <button
                        className="btn-primary flex items-center gap-2"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={18} /> Add Shift
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
                            placeholder="Search by shift name..."
                            className="form-input pl-10 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="text-muted">
                        Loading shifts...
                    </p>
                ) : filteredShifts.length === 0 ? (
                    <p className="text-muted">
                        No shifts found.
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
                <></> // TODO: Make the CreateShiftModal
                // <CreateUserModal
                //     onClose={() => setShowCreateModal(false)}
                //     onCreated={loadUsers}
                // />
            )}
        </>
    );
}