import round from "./round";

export { round };
export const plusNum = (value?: number, currency = "$") =>
    value && value > 0 ? `+${round(value, 2)} ${currency}` : `${round(value, 2)} ${currency}`;

export const roundAmount = (value: number) => {
    if (value < 1) return round(value, 6);
    else return round(value, 2);
};
