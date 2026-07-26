import { useState } from "react";
import { X } from "lucide-react";
import type { CreateActivityDto } from "../../lib/types";

type Props = {
    onClose: () => void;
    onCreate: (dto: CreateActivityDto) => void;
}

export default function CreateActivityModal({ onClose, onCreate }: Props) {
    const [form, setForm] = useState<CreateActivityDto>({ title: "", description: "", dueDate: "" });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // TODO: replace with the real create-activity API call; onCreate currently just updates local state
        onCreate(form);
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="card w-full max-w-lg shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">New Activity</h2>
                    <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input type="text" name="title" value={form.title} onChange={handleChange} className="form-input w-full" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="form-input w-full" rows={3} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Due Date</label>
                        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="form-input w-full" required />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                            {submitting ? "Creating..." : "Create Activity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}