"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
// Chalk Themes
const logTheme = chalk_1.default.bgGreen;
const warningTheme = chalk_1.default.bgYellow;
const errorTheme = chalk_1.default.bgRed;
/**
 * @description   The following Actions are specific to the Console, for the Developer
 *                It's only about logging strings into the Console, with some kind of coloring
 */
//
// Actions
exports.log = (message) => async () => exports.logMessage(message);
exports.warning = (warning) => async () => exports.logWarning(warning);
exports.error = (error) => async () => exports.logError(error);
//
// helpers
/**
 * @description  Reusable form of these functions that are not factory methods, to be reused in other parts of the code, outside actions(), for same logging format
 * @param message
 */
exports.logMessage = (message) => console.log(logTheme(appendGutter(' Log:', 5)) + prependGutter(message, 1));
exports.logWarning = (warning) => console.log(warningTheme(' Warning: ') + prependGutter(warning, 1));
exports.logError = (error) => console.log(errorTheme(appendGutter(' Error:', 3)) + prependGutter(error, 1));
/**
 * @description   Keep the actual console message right-aligned with other logged messages
 * @param copy
 * @param size
 */
const prependGutter = (copy, size = 0) => {
    if (!size) {
        return copy;
    }
    let gutter = '';
    for (let i = 0; i < size; i++) {
        gutter += ' ';
    }
    return gutter + copy;
};
const appendGutter = (copy, size = 0) => {
    if (!size) {
        return copy;
    }
    let gutter = '';
    for (let i = 0; i < size; i++) {
        gutter += ' ';
    }
    return copy + gutter;
};
