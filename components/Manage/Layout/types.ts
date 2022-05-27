import { Dispatch, SetStateAction } from "react";

//TODO: conditional types dates or period
export interface FilterContext {
    dates: {
        dateFrom: string | null;
        dateTo: string | null;
        period: string | null;
    };
    setDates: Dispatch<SetStateAction<{ dateFrom: string | null; dateTo: string | null; period: string | null }>>;
    refreshRate: string;
    setRefreshRate: Dispatch<SetStateAction<string>>;
}
