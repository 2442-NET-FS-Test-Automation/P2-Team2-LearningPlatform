import EventBox from "../../../components/EventBox";
import { DAY_NAMES_SHORT, type ScheduleEvent, type CoursesInfo } from "../../../lib/types";

const HOUR_START = 7;
const HOUR_END = 21;
const HOUR_HEIGHT = 40;

const EVENT_COLORS = [
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
    "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-700",
];

export default function WeeklyScheduleSection({ Courses }: CoursesInfo) {
    const pendingCourses = Courses.filter(c => c.Schedule && c.Schedule.length > 0);

    const events: ScheduleEvent[] = pendingCourses.flatMap((course, courseIndex) =>
        (course.Schedule ?? []).map(s => ({
            ...s,
            CourseName: course.Name,
            ColorClass: EVENT_COLORS[courseIndex % EVENT_COLORS.length],
        }))
    );

    const totalHours = HOUR_END - HOUR_START;
    const hourMarks = Array.from({ length: totalHours + 1 }, (_, i) => HOUR_START + i);

    return (
        <div className="card space-y-4">
            <h2 className="text-xl font-semibold">Weekly Schedule</h2>

            {events.length === 0 ? (
                <p className="text-muted">No scheduled class times for your current courses.</p>
            ) : (
                <div className="overflow-x-auto p-3">
                    <div className="grid min-w-[640px]" style={{ gridTemplateColumns: "3.5rem repeat(7, 1fr)" }}>
                        {/* Header row */}
                        <div />
                        {DAY_NAMES_SHORT.map((day) => (<div key={day} className="pb-2 text-center text-sm font-semibold text-muted">{day}</div>))}

                        {/* Hour label column */}
                        <div className="relative" style={{ height: totalHours * HOUR_HEIGHT }}>
                            {hourMarks.map((h) => (
                                <div
                                    key={h}
                                    className="absolute right-2 -translate-y-1/2 text-xs text-muted"
                                    style={{ top: (h - HOUR_START) * HOUR_HEIGHT }}
                                >
                                    {h}:00
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {DAY_NAMES_SHORT.map((_, dayIndex) => (
                            <div
                                key={dayIndex}
                                className="relative border-l border-slate-200 dark:border-slate-700"
                                style={{ height: totalHours * HOUR_HEIGHT }}
                            >
                                {hourMarks.map((h) => (
                                    <div
                                        key={h}
                                        className="absolute w-full border-t border-slate-100 dark:border-slate-800"
                                        style={{ top: (h - HOUR_START) * HOUR_HEIGHT }}
                                    />
                                ))}

                                {events.filter((e) => e.day === dayIndex)
                                    .map((e, i) => <EventBox key={i} Event={e} HOUR_START={HOUR_START} HOUR_HEIGHT={HOUR_HEIGHT}/>)
                                }
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}