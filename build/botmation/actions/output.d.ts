import { BotAction } from "../interfaces/bot-action.interfaces";
/**
 * @description   Take a PNG screenshot of the current page
 * @param fileName name of the file to save the PNG as
 */
export declare const screenshot: (fileName: string) => BotAction;
/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param sites ['example.com', 'whatever.com']
 * @example   screenshotAll('google.com', 'twitter.com')
 * @experimental
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
export declare const screenshotAll: (...sites: string[]) => BotAction;
