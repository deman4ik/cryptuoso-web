import round from "./round";

export { round };
export const plusNum = (value?: number, currency = "$") =>
    value && value > 0 ? `+${value} ${currency}` : `${value} ${currency}`;
