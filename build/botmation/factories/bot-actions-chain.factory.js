"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_options_1 = require("../helpers/bot-options");
/**
 * @description   Actions() method Factory that will inject the active tab for the BotAction's to operate on
 *                Separated out for future composable actions where an action is a chain of Actions
 * @example       see `login()` under `./src/bots/instagram/auth.ts`
 * @param page
 */
exports.BotActionsChainFactory = (page, overloadOptions = {}, ...injects) => async (...actions) => actions.reduce(async (chain, action) => {
    // Resolve the last returned promise
    await chain;
    // Inject the active page into the BotAction, for it to operate on
    return action(page, bot_options_1.getDefaultBotOptions(overloadOptions), injects);
}, Promise.resolve());
