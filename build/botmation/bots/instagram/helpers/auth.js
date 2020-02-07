"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("botmation/actions/navigation");
const urls_1 = require("botmation/bots/instagram/helpers/urls");
//
// Helpers
// Future: Go into the data, directly, and grab from the database, IndexedDB (redux). There is no data if guest
exports.isLoggedIn = async (page, options) => {
    // Go to the login page
    await navigation_1.goTo(urls_1.getInstagramLoginUrl())(page, options);
    // if you're logged in, Instagram would have redirected you to the feed
    // if you were a guest, logged out, you would be on the Instagram Login URL
    return page.url() !== urls_1.getInstagramLoginUrl();
};
exports.isGuest = async (page, options) => !(await exports.isLoggedIn(page, options));
