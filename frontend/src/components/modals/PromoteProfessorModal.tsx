import { useState } from "react";
import type { UserDto } from "../../lib/types";
import { promoteToProfessor } from "../../api/usersRequest";
import ModalHeader from "./ModalHeader";
import { UserRoundPen } from "lucide-react";
import ErrorMessage from "../ErrorMessage";

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
        <div className="modal-container">
            <div className="card modal-card animate-fade-in-up">
                <ModalHeader 
                    Icon={UserRoundPen} 
                    Title={"Promote to Professor"} 
                    Description={"Promote "+user.firstName+" "+user.lastName+" student account to professor role"} 
                    OnClose={onClose} />

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

                    {error && <ErrorMessage error={error} />}

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