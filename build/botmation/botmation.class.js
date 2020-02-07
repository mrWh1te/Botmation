"use strict";
/**
 * @description    Main source code wrapper to encapsulate main methods for configuring the bot (cookies, page, etc)
 *                 This bot uses a Puppeteer.Page, `activeTab`, to inject into factory produced `BotAction` methods
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bot_actions_chain_factory_1 = require("./factories/bot-actions-chain.factory");
/**
 * @name          Botmation
 * @description   Declarative bot for operating a Puppeteer browser page (tab)
 */
class Botmation {
    /**
     * @param options optional partial to overload default option values (parsed from the config.ts file)
     */
    constructor(page, options = {}, ...injects) {
        this.page = page;
        this.options = options;
        this.injects = injects;
    }
    /**
     * @description    Runs the actual constructor then runs async setup code before returning the `Botmation` instance
     * @param  options   optional to override default options
     */
    static async asyncConstructor(browser, options = {}, ...injects) {
        // Grab the first open page (tab) from the browser, otherwise make a new one
        const pages = await browser.pages();
        const page = pages.length === 0 ? await browser.newPage() : pages[0]; // does this need an await at the start of the expression? That edge case has to be tested, since on browser launch, there is a page open
        // Provide the browser, tab it will be operating in, and any optional overloading options
        return new Botmation(page, options, injects);
    }
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
    async actions(...actions) {
        return bot_actions_chain_factory_1.BotActionsChainFactory(this.page, this.options, ...this.injects)(...actions);
    }
    //
    // Clean up
    /**
     * @description   Close the Page/Tab from the browser that the bot was crawling
     */
    async closePage() {
        if (this.page) {
            await this.page.close();
            console.log(''); // add an empty line too console for separation upon next
        }
    }
}
exports.Botmation = Botmation;
