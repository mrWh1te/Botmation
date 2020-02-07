"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helpers for the Page object from Puppeteer
 */
/**
 * @description   This provides the default options object for the Puppeteer's Page object's goto() method
 *                Particularly configured to work with Instagram's SPA, with the option to overload as needed
 * @param overloadDefaultOptions
 */
exports.getDefaultGoToPageOptions = (overloadDefaultOptions = {}) => (Object.assign({ waitUntil: 'networkidle0' }, overloadDefaultOptions));
