"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description   Delay execution of next line by X milliseconds, promisified so you can await a setTimeout call
 * @param milliseconds
 */
exports.sleep = async (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
