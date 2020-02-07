"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selectors_1 = require("botmation/bots/instagram/selectors");
const modals_1 = require("botmation/bots/instagram/constants/modals");
//
// Helpers
/**
 * @description   Returns a promise that resolves TRUE, if the "Turn on Notifications" modal is in view
 * @param page
 */
exports.isTurnOnNotificationsModalActive = async (page) => {
    const modalHeader = await page.$(selectors_1.MAIN_MODAL_HEADER_SELECTOR);
    const modalHeaderText = await page.evaluate(el => el === null || el.textContent === null ? '' : el.textContent, modalHeader);
    return modalHeader !== null && modalHeaderText === modals_1.TURN_OFF_NOTIFICATIONS_MODAL_HEADER_TEXT;
};
