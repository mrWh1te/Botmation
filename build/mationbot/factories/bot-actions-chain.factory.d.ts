import { Page } from 'puppeteer';
import { BotAction } from '../interfaces/bot-action.interfaces';
/**
 * @description   Actions() method Factory that will inject the active tab for the BotAction's to operate on
 *                Separated out for future composable actions where an action is a chain of Actions
 * @example       see `login()` under `./src/bots/instagram/auth.ts`
 * @param page
 */
export declare const BotActionsChainFactory: (page: Page) => (...actions: BotAction[]) => Promise<void>;
