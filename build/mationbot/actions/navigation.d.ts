import { DirectNavigationOptions } from 'puppeteer';
import { BotAction } from '../interfaces/bot-action.interfaces';
/**
 * @description   Single Higher Order Function for Page Changing
 * @param url
 */
export declare const goTo: (url: string, goToOptions?: DirectNavigationOptions | undefined) => BotAction;
/**
 * @description   Wait for navigation to complete. Helpful after submitting a form, liking logging in.
 */
export declare const waitForNavigation: () => BotAction;
