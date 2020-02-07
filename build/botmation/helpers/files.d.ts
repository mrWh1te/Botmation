/**
 * @description   Simple method to return a Promise to check it a file exists or not
 *                No matter what, the promise WILL resolve and will resolve TRUE or FALSE
 * @param filePath
 * @return Promise<boolean>
 */
export declare const fileExist: (filePath: string) => Promise<unknown>;
export declare const deleteFile: (filePath: string) => Promise<unknown>;
