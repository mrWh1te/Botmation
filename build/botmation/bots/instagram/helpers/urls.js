"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urls_1 = require("botmation/bots/instagram/constants/urls");
/**
 * @description   Provides helpful methods for parsing URL's and getting URL's to crawl (ie Instagram login URL)
 */
exports.getInstagramBaseUrl = () => urls_1.INSTAGRAM_BASE_URL + '/';
exports.getInstagramLoginUrl = () => exports.getInstagramBaseUrl() + urls_1.INSTAGRAM_URL_EXT_LOGIN + '/';
