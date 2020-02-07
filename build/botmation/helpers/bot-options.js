"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 * @param options
 * @future  TODO: Support the Puppeteer Page options
 */
exports.getDefaultBotOptions = (options) => (Object.assign({ screenshots_directory: '', cookies_directory: '' }, options));
