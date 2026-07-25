import { useState } from "react";
import type { UserDto } from "../../lib/types";
import { promoteToProfessor } from "../../api/usersRequest";

interface PromoteProfessorModalProps {
    user: UserDto;
    onClose: () => void;
    onPromoted: () => void;
}

export default function PromoteProfessorModal({
    user,
    onClose,
    onPromoted
}: PromoteProfessorModalProps) {

    const [shiftId, setShiftId] = useState(1);
    const [contractDate, setContractDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            await promoteToProfessor(user.id, {
                shiftId,
                contractDate
            });

            onPromoted();

        }
        catch {
            setError("Couldn't promote user.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="card w-full max-w-md p-6">

                <h2 className="text-2xl font-bold mb-2">
                    Promote to Professor
                </h2>

                <p className="text-sm text-slate-500 mb-6">
                    {user.firstName} {user.lastName}
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <div>
                        <label className="block mb-1 font-medium">
                            Shift
                        </label>

                        <select
                            className="form-input w-full"
                            value={shiftId}
                            onChange={(e) =>
                                setShiftId(Number(e.target.value))
                            }
                        >
                            <option value={1}>Morning</option>
                            <option value={2}>Afternoon</option>
                            <option value={3}>Evening</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Contract Date
                        </label>

                        <input
                            type="date"
                            className="form-input w-full"
                            value={contractDate}
                            onChange={(e) =>
                                setContractDate(e.target.value)
                            }
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            className="btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Promoting..."
                                : "Promote"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}