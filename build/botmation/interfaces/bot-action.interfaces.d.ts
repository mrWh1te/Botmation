import { Page } from 'puppeteer';
import { BotOptions } from './bot-options.interfaces';
/**
 * @description   Base Interface for the Higher-Order Action implementations to enable IDE assistance, strong type checking, etc
 */
export interface BotActionFactory extends Function {
    (...args: any[]): BotAction;
}
export interface BotAction extends Function {
    (page: Page, options: BotOptions, ...injects: any[]): Promise<void>;
}
