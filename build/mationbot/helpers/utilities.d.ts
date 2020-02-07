import 'module-alias/register';
import { Page } from 'puppeteer';
import { BotAction } from '../interfaces/bot-action.interfaces';
/**
 *
 * @param page
 * @param actions
 */
export declare const applyBotActionOrActions: (page: Page, actions: BotAction | BotAction[]) => Promise<void>;
