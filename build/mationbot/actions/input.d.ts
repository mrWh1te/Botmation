import { BotAction } from '../interfaces/bot-action.interfaces';
/**
 * @description   Manually click an element on the page based on the query selector provided
 * @param selector
 */
export declare const click: (selector: string) => BotAction;
/**
 * @description   Using the keyboard, being typing. It's best that you focus/click a form input element 1st, or something similar
 * @param copy
 */
export declare const type: (copy: string) => BotAction;
