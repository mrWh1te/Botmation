"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description   Pipeable methods for crawling/interacting with the main feed page in Instagram
 * @param usernames
 */
/**
 * @description   Favorite all published photos from these usernames
 * @param usernames
 */
exports.favoriteAllFrom = (...usernames) => async (page) => {
    console.log(`favorite all from ${usernames.join(', ')}`);
};
