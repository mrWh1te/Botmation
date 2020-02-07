"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const config_1 = require("./../../config");
const console_1 = require("../actions/console");
const urls_1 = require("../helpers/urls");
/**
 * @description   Parse page's cookies to save as JSON in local file
 * @param fileName
 * @example saveCookies('cookies') -> creates `cookies.json`
 */
exports.saveCookies = (fileName) => async (page) => {
    try {
        const cookies = await page.cookies();
        await fs_1.promises.writeFile(`${urls_1.createURL('.', config_1.ROOT_ASSETS_DIRECTORY, config_1.ASSETS_COOKIES_DIRECTORY)}${fileName}.json`, JSON.stringify(cookies, null, 2));
    }
    catch (error) {
        console_1.logError('[BotAction:saveCookies] ' + error);
    }
};
/**
 * @description   Parse the file created with saveCookies() into cookies to load into the page
 * @param fileName
 * @example loadCookies('./cookies.json')
 */
exports.loadCookies = (fileName) => async (page) => {
    try {
        const file = await fs_1.promises.readFile(`${urls_1.createURL('.', config_1.ROOT_ASSETS_DIRECTORY, config_1.ASSETS_COOKIES_DIRECTORY)}${fileName}.json`);
        const cookies = JSON.parse(file.toString());
        for (const cookie of cookies) {
            await page.setCookie(cookie);
        }
    }
    catch (error) {
        console_1.logError('[BotAction:loadCookies] ' + error);
    }
};
