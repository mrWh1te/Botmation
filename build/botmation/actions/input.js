"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description   Manually click an element on the page based on the query selector provided
 * @param selector
 */
exports.click = (selector) => async (page) => await page.click(selector);
/**
 * @description   Using the keyboard, being typing. It's best that you focus/click a form input element 1st, or something similar
 * @param copy
 */
exports.type = (copy) => async (page) => await page.keyboard.type(copy);
