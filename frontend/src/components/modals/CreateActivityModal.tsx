import { useState } from "react";
import { ClipboardList } from "lucide-react";
import type { CreateActivityDto } from "../../lib/types";
import { getApiError } from "../../lib/funcs";
import ErrorMessage from "../ErrorMessage";
import ModalHeader from "./ModalHeader";

type Props = {
    onClose: () => void;
    onCreate: (dto: CreateActivityDto) => Promise<void>;
}

export default function CreateActivityModal({ onClose, onCreate }: Props) {
    const [form, setForm] = useState<CreateActivityDto>({ title: "", description: "", dueDate: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const selectedDate = new Date(form.dueDate);
        if(selectedDate <= new Date()) {
            setError("Due date must be in the future");
            setSubmitting(false);
            return;
        }

        try {
            const dto: CreateActivityDto = {
                ...form,
                dueDate: new Date(form.dueDate).toISOString()
            };
            await onCreate(dto);
            
        }catch(err: unknown){
            setError(getApiError(err));
        }finally{
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-container">
            <div className="modal-card card animate-fade-in-up">
                <ModalHeader 
                    Icon={ClipboardList} 
                    Title={"New Activity"} 
                    Description={"Assign new coursework to this course"} 
                    OnClose={onClose} />

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

                    {error && <ErrorMessage error={error} />}

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
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