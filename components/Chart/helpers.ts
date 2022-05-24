import { PerformanceVals } from "@cryptuoso/components/Stats";
import { Time } from "lightweight-charts";

export function formatAreaChartData(data?: PerformanceVals) {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    return data?.map(({ x, y }) => ({ time: (x / 1000) as Time, value: y }));
}
