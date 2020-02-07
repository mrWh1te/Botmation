/**
 * @description   Delay execution of next line by X milliseconds, promisified so you can await a setTimeout call
 * @param milliseconds
 */
export declare const sleep: (milliseconds: number) => Promise<any>;
