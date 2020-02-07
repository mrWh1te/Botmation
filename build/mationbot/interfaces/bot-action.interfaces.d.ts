import { Page } from 'puppeteer';
/**
 * @description   Base Interface for the Higher-Order Action implementations to enable IDE assistance, strong type checking, etc
 */
export interface BotActionFactory extends Function {
    (...args: any[]): BotAction;
}
export interface BotAction extends Function {
    (page: Page): Promise<void>;
}
