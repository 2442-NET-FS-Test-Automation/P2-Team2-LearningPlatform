import { useState } from "react";
import { ChevronDown, GraduationCap, Trash2, RotateCcw } from "lucide-react";
import type { ActivityWithSubmissions, Submission } from "../lib/types";
import { getApiError } from "../lib/funcs";
import ErrorMessage from "./ErrorMessage";

type Props = {
    activity: ActivityWithSubmissions;
    onGrade: (submissionId: number, grade: number, feedback: string) => Promise<void>;
    onDelete: (id:number)=>void;
    onReactivate:(id:number)=>void;
    activityTab:"active"|"archived";
}

export default function ProfessorActivityAccordion({ 
    activity, 
    onGrade,
    onDelete,
    onReactivate,
    activityTab
}: Props) {
    const [open, setOpen] = useState(false);
    const ungraded = activity.submissions.filter(s => s.gradedAt == null).length;

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setOpen(prev => !prev)}
                    className="flex flex-1 items-center justify-between text-left"
                >
                    <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted">
                            {activity.submissions.length} submission{activity.submissions.length !== 1 ? "s" : ""}
                            {ungraded > 0 && ` · ${ungraded} awaiting grade`}
                        </p>
                    </div>

                    <ChevronDown
                        size={20}
                        className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {activityTab === "active" ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(activity.id);
                        }}
                        className="ml-3 rounded-full p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                        title="Archive activity"
                    >
                        <Trash2 size={18}/>
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReactivate(activity.id);
                        }}
                        className="ml-3 rounded-full p-2 text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                        title="Reactivate activity"
                    >
                        <RotateCcw size={18}/>
                    </button>
                )}
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
            >
                <div className="divider-block space-y-3">
                    {activity.submissions.length === 0 ? (
                        <p className="text-sm text-muted">
                            No submissions yet.
                        </p>
                    ) : (
                        activity.submissions.map((s) => (
                            <SubmissionRow
                                key={s.id}
                                submission={s}
                                onGrade={onGrade}
                            />
                        ))
                    )}
                </div>
            </div>
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

            <div className="flex flex-col mt-3 gap-2">
                <div className="flex flex-grow flex-col gap-2 sm:flex-row">
                    <input
                        type="number"
                        min={0}
                        max={100}
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Grade"
                        className="form-input max-w-20"
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
                </div>
                {error && <div className="col-span-3"><ErrorMessage error={error} /></div>}
            </div>
        </div>
    );
}