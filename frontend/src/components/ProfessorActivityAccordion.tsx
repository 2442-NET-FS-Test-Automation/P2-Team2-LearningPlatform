import { useState } from "react";
import { ChevronDown, GraduationCap } from "lucide-react";
import type { ActivityWithSubmissions, Submission } from "../lib/types";

type Props = {
    activity: ActivityWithSubmissions;
    onGrade: (submissionId: number, grade: number, feedback: string) => void;
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
    const [grade, setGrade] = useState(submission.grade?.toString() ?? "");
    const [feedback, setFeedback] = useState(submission.feedback ?? "");
    const isGraded = submission.gradedAt != null;

    return (
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
                {/* TODO: swap studentId for the student's name once the API includes it */}
                Student #{submission.studentId} · Submitted {new Date(submission.submittedAt).toLocaleDateString()}
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
                    onClick={() => onGrade(submission.id, Number(grade), feedback)}
                    disabled={grade === ""}
                    className="btn-primary gap-2 disabled:opacity-60"
                >
                    <GraduationCap size={16} />
                    {isGraded ? "Update" : "Save"}
                </button>
            </div>
        </div>
    );
}