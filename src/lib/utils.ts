import { addMinutes, format, parse, set } from "date-fns";

export const TIME_SLOTS = Array.from({ length: 145 }, (_, i) => { // 09:00 to 21:00 (12 hours * 12 slots + 1)
    const start = set(new Date(), { hours: 9, minutes: 0, seconds: 0 });
    return format(addMinutes(start, i * 5), "HH:mm");
});

export const TOTAL_MINUTES = 12 * 60; // 09:00 to 21:00
export const PIXELS_PER_MINUTE = 2; // Scale of the chart
