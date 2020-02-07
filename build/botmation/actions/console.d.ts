import { BotAction } from '../interfaces/bot-action.interfaces';
/**
 * @description   The following Actions are specific to the Console, for the Developer
 *                It's only about logging strings into the Console, with some kind of coloring
 */
export declare const log: (message: string) => BotAction;
export declare const warning: (warning: string) => BotAction;
export declare const error: (error: string) => BotAction;
/**
 * @description  Reusable form of these functions that are not factory methods, to be reused in other parts of the code, outside actions(), for same logging format
 * @param message
 */
export declare const logMessage: (message: string) => void;
export declare const logWarning: (warning: string) => void;
export declare const logError: (error: string) => void;
