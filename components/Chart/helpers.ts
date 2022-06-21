import { PerformanceVals } from "@cryptuoso/types";
import { round } from "@cryptuoso/helpers";
import { Time } from "lightweight-charts";

export function uniqueElementsByWithReverse<T>(arr: T[], fn: (a: T, b: T) => boolean): T[] {
    return arr
        .reverse()
        .reduce((acc: T[], v: T) => {
            if (!acc.some((x) => fn(v, x))) acc.push(v);
            return acc;
        }, [])
        .reverse();
}

export function formatAreaChartData(data?: PerformanceVals) {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    return uniqueElementsByWithReverse(
        data?.map(({ x, y }) => ({ time: (x / 1000) as Time, value: y })),
        (a, b) => a.time === b.time
    );
}
