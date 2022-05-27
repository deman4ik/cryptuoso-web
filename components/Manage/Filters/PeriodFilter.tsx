import { Select } from "@mantine/core";
import dayjs from "@cryptuoso/libs/dayjs";
import { Clock, ClockOff } from "tabler-icons-react";
import { FilterContext } from "../Layout";
import ms from "ms";

export function periodToDate(period: string | null) {
    if (!period || period === "off") return null;
    return dayjs.utc().subtract(ms(period), "millisecond").toISOString();
}

export function filterDatesToQuery(dates: FilterContext["dates"]) {
    if (dates.period) {
        dates.dateFrom = periodToDate(dates.period);
        dates.dateTo = null;
    }
    let dateQuery = "";
    if (dates.dateFrom && dates.dateTo) {
        dateQuery = ` _and: [{ created_at: { _gte: "${dates.dateFrom}" } }, { created_at: { _lte: "${dates.dateFrom}" } }]`;
    } else if (dates.dateFrom && !dates.dateTo) {
        dateQuery = ` created_at: { _gte: "${dates.dateFrom}" }`;
    } else if (!dates.dateFrom && dates.dateTo) {
        dateQuery = ` created_at: { _lte: "${dates.dateTo}" }`;
    }
    return dateQuery;
}

export function PeriodFilter({
    dates,
    setDates
}: {
    dates: FilterContext["dates"];
    setDates: FilterContext["setDates"];
}) {
    //TODO: dateFrom, dateTo

    const value = dates.period;

    return (
        <Select
            icon={value === "off" ? <ClockOff size={18} /> : <Clock size={18} />}
            value={value}
            onChange={(e) => {
                if (e)
                    setDates({
                        dateFrom: periodToDate(e),
                        dateTo: null,
                        period: e
                    });
            }}
            size="xs"
            variant="filled"
            sx={{ width: "115px" }}
            data={[
                { value: "off", label: "Off" },
                { value: "1d", label: "Last day" },
                { value: "7d", label: "Last week" },
                { value: "30d", label: "Last 30d" },
                { value: "60d", label: "Last 60d" },
                { value: "90d", label: "Last 90d" }
            ]}
        />
    );
}
