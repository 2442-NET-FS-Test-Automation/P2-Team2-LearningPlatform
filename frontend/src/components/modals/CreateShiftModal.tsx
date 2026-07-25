import { X } from "lucide-react";
import { useState } from "react";
import { createShift } from "../../api/shiftsRequests";

interface Props {
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateUserModal({
    onClose,
    onCreated
}: Props) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        startTime: "",
        endTime: ""
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await createShift(form).finally(() => setIsSubmitting(false));

            await onCreated();
            onClose();
        } catch (err: any) {
            console.error(err.response?.data);
            setError(err.response?.data.error);
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="card w-full max-w-3xl max-h-screen shadow-xl overflow-auto animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Create shift
                            </h2>

                            <p className="text-sm text-muted">
                                Add a new shift for professors
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white text-xl"
                        >
                            <X />
                        </button>
                    </div>
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
                        {/* Footer */}
                        <div className="flex justify-end gap-3 border-t pt-5">
                            {error && <p className="flex items-center align-center text-sm text-red-600 dark:text-red-400">{error}</p>}
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
        </>
    );
}