import { BotAction } from '../../../interfaces/bot-action.interfaces';
/**
 * @description   Pipeable methods for crawling/interacting with the main feed page in Instagram
 * @param usernames
 */
/**
 * TODO: implement, use doWhile(scrolling feed)(like posts) until we can't scroll anymore (NO, found bottom of page, that message that there are no more new posts)
 * @description   Favorite all published photos from these usernames
 * @param usernames
 */
export declare const favoriteAllFrom: (...usernames: string[]) => BotAction;
