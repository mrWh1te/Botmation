"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../helpers/utilities");
const actions_1 = require("../helpers/actions");
const bot_actions_chain_factory_1 = require("../factories/bot-actions-chain.factory");
/**
 * @description   Pauses the bot for the provided milliseconds before letting it execute the next Action
 * @param milliseconds
 */
exports.wait = (milliseconds) => async () => await utilities_1.sleep(milliseconds);
/**
 * @description givenThat(promise resolves to TRUE)(then run these actions in a chain)
 *              A function that returns a function that returns a function
 *              BotFactoryProvider -> BotFactoryAction -> BotAction
 *
 *              In essence, this is a BotAction to run a provided chain of BotActions (2nd usage call), given that a promised condition (1st usage call) resolves to TRUE
 * @example     givenThat(isGuest)(login(...), closeSomePostLoginModal(),... more BotAction's)
 *              The condition function is async and provided the Puppeteer page instance so you can use it to determine TRUE/FALSE
 * @param condition
 */
exports.givenThat = (condition) => (...actions) => async (page, options, ...injects) => {
    try {
        if (await condition(page, options, ...injects)) {
            await bot_actions_chain_factory_1.BotActionsChainFactory(page, options, ...injects)(...actions);
        }
    }
    catch (error) {
        // logError(error)
    }
};
exports.forAll = (collection) => (botActionOrActionsFactory) => async (page, options, ...injects) => {
    if (Array.isArray(collection)) {
        // Array
        for (let i = 0; i < collection.length; i++) {
            await actions_1.applyBotActionOrActions(page, options, botActionOrActionsFactory(collection[i]), ...injects);
        }
    }
    else {
        // Dictionary
        for (const [key, value] of Object.entries(collection)) {
            await actions_1.applyBotActionOrActions(page, options, botActionOrActionsFactory(key, value), ...injects);
        }
    }
};
/**
 * @description    Similar to givenThat, except it will keep running the sequence of actions until the condition is no longer TRUE
 * @experimental
 * @param condition
 */
exports.doWhile = (condition) => (...actions) => async (page, options, ...injects) => {
    try {
        let resolvedCondition = await condition(page, options, ...injects);
        while (resolvedCondition) {
            await bot_actions_chain_factory_1.BotActionsChainFactory(page, options, ...injects)(...actions);
            resolvedCondition = await condition(page, options, ...injects);
        }
    }
    catch (error) {
        // logError(error)
    }
};
