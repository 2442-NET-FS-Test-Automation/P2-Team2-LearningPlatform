import type { CourseScheduleListProps } from "../lib/types";
import { getDayName } from "../lib/funcs";
import { Calendar } from "lucide-react";

export default function CourseScheduleList({ Schedule }: CourseScheduleListProps) {
    if (!Schedule || Schedule.length === 0) return null;

    return (
        <div className="divider-block">
            <h2 className="text-xl font-semibold">Schedule</h2>
            <ul className="mt-2 space-y-2">
                {Schedule.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted">
                        <Calendar size={16} />
                        {getDayName(s.Day)}, {s.StartTime} - {s.EndTime}
                    </li>
                ))}
            </ul>
        </div>
    );
}