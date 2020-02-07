"use strict";
/**
 * Barrel of Exports
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Class
__export(require("./mation-bot.class"));
// Main Actions Factory
__export(require("./factories/bot-actions-chain.factory"));
// Actions (simplifies imports)
__export(require("./actions/console"));
__export(require("./actions/cookies"));
__export(require("./actions/input"));
__export(require("./actions/navigation"));
__export(require("./actions/output"));
__export(require("./actions/utilities"));
