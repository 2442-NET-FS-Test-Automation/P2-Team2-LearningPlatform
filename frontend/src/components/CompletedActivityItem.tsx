import { CheckCircle2, Clock3 } from "lucide-react";
import type { Activity, Submission } from "../lib/types";

type Props = {
    activity: Activity;
    submission: Submission;
}

export default function CompletedActivityItem({ activity, submission }: Props) {
    const isGraded = submission.gradedAt != null && submission.score != null;

    return (
        <div className="card space-y-2">
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{activity.title}</h3>
                {isGraded ? (
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {submission.score}/100
                    </span>
                ) : (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Clock3 size={14} />
                        Awaiting grade
                    </span>
                )}
            </div>

            <p className="text-sm text-muted">
                Submitted {new Date(submission.submittedAt).toLocaleDateString()}
            </p>

            {isGraded && submission.feedback && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-muted dark:bg-slate-800/60">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Feedback: </span>
                    {submission.feedback}
                </div>
            )}

            {isGraded && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={14} />
                    Graded
                </div>
            )}
        </div>
    );
}