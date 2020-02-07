"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_actions_chain_factory_1 = require("../factories/bot-actions-chain.factory");
/**
 *
 * @param page
 * @param actions
 */
exports.applyBotActionOrActions = async (page, options, actions, ...injects) => {
    if (Array.isArray(actions)) {
        await bot_actions_chain_factory_1.BotActionsChainFactory(page, options, ...injects)(...actions);
    }
    else {
        await bot_actions_chain_factory_1.BotActionsChainFactory(page, options, ...injects)(actions);
    }
};
