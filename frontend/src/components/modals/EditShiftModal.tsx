import { useState } from "react";
import type { ShiftDto, UpdateShiftDto } from "../../lib/types";
import { updateShift } from "../../api/shiftsRequests";
import { isValidTimeRange } from "../../lib/funcs";
import { ClockArrowUp } from "lucide-react";
import ModalHeader from "./ModalHeader";
import ErrorMessage from "../ErrorMessage";

interface EditShiftModalProps {
    shift: ShiftDto;
    onClose: () => void;
    onUpdated: () => void;
}

export default function EditShiftModal({
    shift,
    onClose,
    onUpdated
}: EditShiftModalProps) {
    const [form, setForm] = useState({
        name: shift.name,
        endTime: shift.endTime,
        startTime: shift.startTime
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if(!isValidTimeRange(form.startTime, form.endTime)) {
            setError("Shift time should be at least one hour");
            setIsSubmitting(false);
            return;
        }

        const dto:UpdateShiftDto = {};
        if (form.name !== shift.name) dto.name = form.name;
        if (form.startTime !== shift.startTime) dto.startTime = form.startTime;
        if (form.endTime !== shift.endTime) dto.endTime = form.endTime;

        try {
            await updateShift(shift.id, dto).finally(() => setIsSubmitting(false));

            await onUpdated();
            onClose();
        } catch (err: any) {
            console.error(err.response?.data);
            setError(err.response?.data);
        }
    }

    return (
        <div className="modal-container">
            <div className="card modal-card animate-fade-in-up">
                <ModalHeader 
                    Icon={ClockArrowUp} 
                    Title={"Edit Shifts"} 
                    Description={"Edit an existing shift"} 
                    OnClose={onClose} />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex-col">
                        <label className="form-label">Name</label>
                        <input
                            className="form-input"
                            placeholder="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-label mt-3">Start time</label>
                        <input
                            type="time"
                            className="form-input"
                            placeholder="Start time"
                            name="startTime"
                            value={form.startTime}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-label mt-3">End time</label>
                        <input
                            type="time"
                            className="form-input"
                            placeholder="End time"
                            name="endTime"
                            value={form.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <ErrorMessage error={error} />}
                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn-primary py-3 font-semibold">
                            {isSubmitting ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
);
}