import round from "./round";

export { round };
export const plusNum = (value?: number) => (value && value > 0 ? `+${value} $` : `${value} $`);
