import { BotAction } from '../../../interfaces/bot-action.interfaces';
/**
 * @description   Pipeable methods for crawling/interacting with the main feed page in Instagram
 * @param usernames
 */
/**
 * @description   Favorite all published photos from these usernames
 * @param usernames
 */
export declare const favoriteAllFrom: (...usernames: string[]) => BotAction;
