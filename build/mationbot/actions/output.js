"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = require("@helpers/assets");
const utilities_1 = require("@mationbot/actions/utilities");
const navigation_1 = require("@mationbot/actions/navigation");
/**
 * @description   Take a PNG screenshot of the current page
 * @param fileName name of the file to save the PNG as
 */
exports.screenshot = (fileName) => async (page) => {
    await page.screenshot({ path: assets_1.getScreenshotLocalFilePath(`${fileName}.png`) });
};
/**
 * @description    given a list of websites, the bot will visit each, wait for them to load, then take a screenshot to save in the escreenshot directory
 * @param sites ['example.com', 'whatever.com']
 * @example   screenshotAll('google.com', 'twitter.com')
 * @experimental
 * @request   add ability like via a closure, to customize the filename for easier reuse in a cycle (like ability to timestamp the file etc)
 */
exports.screenshotAll = (...sites) => async (page) => utilities_1.forAll(sites)((siteName) => ([
    navigation_1.goTo('https://' + siteName),
    exports.screenshot(siteName)
]))(page);
