"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modals_1 = require("botmation/bots/instagram/constants/modals");
/**
 * @description   Bot action that closes the "Turn on Notifications" modal by clicking a "no" option
 */
exports.closeTurnOnNotificationsModal = () => async (page) => {
    // click button with text "Not Now" inside the dialog
    // we don't want to deal with Notifications within the web app
    const [button] = await page.$x("//button[contains(., '" + modals_1.TURN_OFF_NOTIFICATIONS_BUTTON_LABEL + "')]");
    if (button) {
        await button.click();
    }
};
