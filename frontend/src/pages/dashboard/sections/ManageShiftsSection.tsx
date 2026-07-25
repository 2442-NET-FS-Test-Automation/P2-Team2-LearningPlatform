import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash } from "lucide-react";

import PaginationControls from "../../../components/layout/PaginationControls";
import CreateShiftModal from "../../../components/modals/CreateShiftModal";

import { getShifts } from "../../../api/shiftsRequests";
import type { ShiftDto } from "../../../lib/types";

export default function ManageShiftsSection() {
    const [shifts, setShifts] = useState<ShiftDto[]>([]); // TODO: Specify type
    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [created, setCreated] = useState(false);
    
    useEffect(() => {
        setLoading(true);

        getShifts(currentPage, itemsPerPage)
            .then((res) => {
                console.log(res)
                setShifts(res.items);
                setTotalPages(res.totalPages);
            })
            .catch((e) => {
                setError(e);
            })
            .finally(() =>{
                setLoading(false);
            });
    }, []);

    useMemo(() => {
        setCurrentPage(1);
    }, [search, itemsPerPage, created]);

    // Pagination handlers
    const handlePrevious = () => { setCurrentPage((prev) => Math.max(prev - 1, 1)) };
    const handleNext = () => { setCurrentPage((prev) => Math.min(prev + 1, totalPages)) };
    const goToPage = (pagenum: number) => { setCurrentPage(Math.min(Math.max(pagenum, 1), totalPages)) };

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

                {/* Search */}
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
                ) : shifts.length === 0 ? (
                    <p className="text-muted">
                        No shifts found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-slate-500 dark:text-slate-400">
                                    <th className="py-3">Name</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Assignees</th>
                                </tr>
                            </thead>

                            <tbody>
                                {shifts.map((shift) => (
                                    <tr
                                        key={shift.id}
                                        className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="py-3">{shift.name}</td>
                                        <td>{shift.startTime}</td>
                                        <td>{shift.endTime}</td>
                                        <td>{shift.assignees ? shift.assignees : 0}</td>

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
                                ))}
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
                <CreateShiftModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {setCreated((c) => !c)}}
                />
            )}
        </>
    );
}