import { useState } from "react";
import { ChevronDown, GraduationCap } from "lucide-react";
import type { ActivityWithSubmissions, Submission } from "../lib/types";
import { getApiError } from "../lib/funcs";

type Props = {
    activity: ActivityWithSubmissions;
    onGrade: (submissionId: number, grade: number, feedback: string) => Promise<void>;
}

export default function ProfessorActivityAccordion({ activity, onGrade }: Props) {
    const [open, setOpen] = useState(false);
    const ungraded = activity.submissions.filter(s => s.gradedAt == null).length;

    return (
        <div className="card">
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
                <div>
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="text-sm text-muted">
                        {activity.submissions.length} submission{activity.submissions.length !== 1 ? "s" : ""}
                        {ungraded > 0 && ` · ${ungraded} awaiting grade`}
                    </p>
                </div>
                <ChevronDown size={20} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="divider-block mt-4 space-y-3">
                    {activity.submissions.length === 0 ? (
                        <p className="text-sm text-muted">No submissions yet.</p>
                    ) : (
                        activity.submissions.map((s) => (
                            <SubmissionRow key={s.id} submission={s} onGrade={onGrade} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function SubmissionRow({ submission, onGrade }: { submission: Submission, onGrade: Props["onGrade"] }) {
    const [grade, setGrade] = useState(submission.score?.toString() ?? "");
    const [feedback, setFeedback] = useState(submission.feedback ?? "");
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const isGraded = submission.gradedAt != null;

    const handleGrade = async () => {
        setSaving(true);
        setError(null);
        try{
            await onGrade(submission.id, Number(grade), feedback);
        }catch (err: unknown){
            setError(getApiError(err));
        }
        finally {
            setSaving(false);
        }
    }

    return (
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Student {submission.studentName} #{submission.studentId} · Submitted {new Date(submission.submittedAt).toLocaleDateString()}
            </p>
            <p className="mt-2 text-sm">{submission.file}</p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[100px_1fr_auto] sm:items-start">
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Grade"
                    className="form-input"
                />
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Feedback"
                    className="form-input"
                    rows={1}
                />
                <button
                    onClick={handleGrade}
                    disabled={grade === "" || saving}
                    className="btn-primary gap-2 disabled:opacity-60"
                >
                    <div className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        {saving? "Saving..." : isGraded ? "Update" : "Save"}
                    </div>
                </button>
                {error &&(
                    <p className="mt-2 text-sm text-red-500 dark:text-red-400 whitespace-nowrap">{error}</p>               
                )}
            </div>
        </div>
    );
}