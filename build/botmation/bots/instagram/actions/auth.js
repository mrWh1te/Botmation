"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_actions_chain_factory_1 = require("../../../factories/bot-actions-chain.factory");
const navigation_1 = require("../../../actions/navigation");
const console_1 = require("../../../actions/console");
const urls_1 = require("../../../bots/instagram/helpers/urls");
const selectors_1 = require("botmation/bots/instagram/selectors");
const input_1 = require("botmation/actions/input");
/**
 * @description  BotAction that attempts the login flow for Instagram
 *               This BotAction is a great example of how 1 Action can wrap a whole other list of Action's, while using the same actions() code design
 * @param {username, password} destructured from BotAuthOptions
 */
exports.login = ({ username, password }) => async (page, options, ...injects) => 
// This is how a single BotAction can run its own sequence of BotAction's prior to the next call of the original bot.actions() sequence
bot_actions_chain_factory_1.BotActionsChainFactory(page, options, ...injects)(navigation_1.goTo(urls_1.getInstagramLoginUrl()), input_1.click(selectors_1.FORM_AUTH_USERNAME_INPUT_SELECTOR), input_1.type(username), input_1.click(selectors_1.FORM_AUTH_PASSWORD_INPUT_SELECTOR), input_1.type(password), input_1.click(selectors_1.FORM_AUTH_SUBMIT_BUTTON_SELECTOR), navigation_1.waitForNavigation(), console_1.log('Login Complete'));
