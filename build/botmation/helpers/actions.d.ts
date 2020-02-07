import { Page } from 'puppeteer';
import { BotAction } from '../interfaces/bot-action.interfaces';
import { BotOptions } from '../interfaces/bot-options.interfaces';
/**
 *
 * @param page
 * @param actions
 */
export declare const applyBotActionOrActions: (page: Page, options: BotOptions, actions: BotAction | BotAction[], ...injects: any[]) => Promise<void>;
