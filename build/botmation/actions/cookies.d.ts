import { BotAction } from '../interfaces/bot-action.interfaces';
/**
 * @description   Parse page's cookies to save as JSON in local file
 * @param fileName
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
export declare const saveCookies: (fileName: string) => BotAction;
/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 * @param fileName
 * @example loadCookies('./cookies.json')
 */
export declare const loadCookies: (fileName: string) => BotAction;
