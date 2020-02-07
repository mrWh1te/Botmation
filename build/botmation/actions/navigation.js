"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("../helpers/navigation");
const console_1 = require("./console");
/**
 * @description   Single Higher Order Function for Page Changing
 * @param url
 */
exports.goTo = (url, goToOptions) => async (page) => {
    if (!goToOptions) {
        // optional param, when not provided, we provide the default value
        goToOptions = navigation_1.getDefaultGoToPageOptions();
    }
    if (page.url() === url) {
        // same url check
        console_1.logWarning('[Action:goTo] url requested is already active');
        return;
    }
    await page.goto(url, goToOptions);
};
/**
 * @description   Wait for navigation to complete. Helpful after submitting a form, liking logging in.
 */
exports.waitForNavigation = () => async (page) => {
    await page.waitForNavigation();
};
