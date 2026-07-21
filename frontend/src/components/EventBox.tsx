import { minutesFromMidnight } from "../lib/funcs";
import type { ScheduleEvent } from "../lib/types";

export type EventBoxProps = {
    Event: ScheduleEvent;
    HOUR_START: number;
    HOUR_HEIGHT: number;
}

export default function EventBox({ Event, HOUR_START, HOUR_HEIGHT }: EventBoxProps) {
    const start = minutesFromMidnight(Event.StartTime);
    const end = minutesFromMidnight(Event.EndTime);
    const top = ((start - HOUR_START * 60) / 60) * HOUR_HEIGHT;
    const height = ((end - start) / 60) * HOUR_HEIGHT;

    return (
        <div
            className={`absolute left-0.5 right-0.5 overflow-hidden rounded-md border px-1.5 py-1 text-[11px] leading-tight ${Event.ColorClass}`}
            style={{ top, height: Math.max(height, 18) }}
            title={`${Event.CourseName}: ${Event.StartTime}-${Event.EndTime}`}
        >
            <p className="font-semibold truncate">{Event.CourseName}</p>
            <p className="truncate">{Event.StartTime}-{Event.EndTime}</p>
        </div>
    );
}