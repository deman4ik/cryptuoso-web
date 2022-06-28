export * from "./number";
export * from "./types";
export * from "./pricing";
export * from "./portfolio";
export * from "./objects";

/**
 * Delays the execution of an asynchronous function by the specified time in miliseconds
 *
 * @param ms miliseconds
 * @example
 * async function delayedLog() {
 *  console.log("Wait for it...");
 *  await sleep(1000);
 *  console.log("Boo");
 * }
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
