/**
 * @description    Main source code wrapper to encapsulate main methods for configuring the bot (cookies, page, etc)
 *                 This bot uses a Puppeteer.Page, `activeTab`, to inject into factory produced `BotAction` methods
 */
import { Page, Browser } from 'puppeteer';
import { BotOptions } from './interfaces/bot-options.interfaces';
import { BotAction } from './interfaces/bot-action.interfaces';
import { MationBotInterface } from './interfaces/mation-bot.interface';
/**
 * @name          MationBot
 * @description   Declarative bot for operating a Puppeteer browser page (tab)
 */
export declare class MationBot implements MationBotInterface {
    /**
     * @description   Page/Tab of the brower the bot is crawling
     */
    private page;
    private options;
    /**
     * @param options optional partial to overload default option values (parsed from the config.ts file)
     */
    constructor(page: Page, options?: Partial<BotOptions>);
    /**
     * @description    Runs the actual constructor then runs async setup code before returning the `MationBot` instance
     * @param  options   optional to override default options
     */
    static asyncConstructor(browser: Browser, options?: Partial<BotOptions>): Promise<MationBot>;
    /**
     * @description   Run BotAction's in sequence - Declaratively
     *                Supports the higher-order functions in the actions/ directory
     *                They return async functions with the active puppeteer.page injected so the function can crawl/interact with the webpage
     *
     *                This function makes it easy to chain promises together while injecting the activePage with a cleaner syntax
     *                So instead of
     *                  await bot.feed()
     *                  await bot.favoriteAllFrom(...)
     *
     *                We remove multiple "awaits" and the need for "bot." for chaining actions
     *
     *                This is in-part, based on a promisified pipe, but this does not take the output of the last operation as input for the next.
     * @example
     *                  await bot.actions(
     *                    goTo('feed'),
     *                    favoriteAllFrom('username1', 'username2')
     *                  )
     * @param actions
     */
    actions(...actions: BotAction[]): Promise<void>;
    /**
     * @description   Close the Page/Tab from the browser that the bot was crawling
     */
    closePage(): Promise<void>;
}
