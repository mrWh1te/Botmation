/**
 * @description   Delay execution of next line by X milliseconds, promisified so you can await a setTimeout call
 * @param milliseconds 
 */
export const sleep = async(milliseconds: number): Promise<any> => // TODO: confirm 'async' is necessary
  new Promise(resolve => setTimeout(resolve, milliseconds))