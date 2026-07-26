import { useState } from "react";
import { CalendarClock, Send } from "lucide-react";
import type { Activity } from "../../lib/types";

type Props = {
    activity: Activity;
    onSubmit: (text: string) => void;
    isSubmitting?: boolean;
}

export default function ActivitySubmissionForm({ activity, onSubmit, isSubmitting = false }: Props) {
    const [text, setText] = useState("");

    const dueDate = new Date(activity.dueDate);
    const isOverdue = dueDate.getTime() < Date.now();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text.trim());
    };

    return (
        <div className="card space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="mt-1 text-sm text-muted">{activity.description}</p>
                </div>
                <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isOverdue
                            ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                            : "amber-accent-chip"
                        }`}
                >
                    <CalendarClock size={14} />
                    Due {dueDate.toLocaleDateString()}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your submission..."
                    className="form-input w-full"
                    rows={3}
                    required
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !text.trim()}
                        className="btn-primary gap-2 disabled:opacity-60"
                    >
                        <Send size={16} />
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}