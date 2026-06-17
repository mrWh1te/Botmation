import { goTo } from "@botmation/puppeteer";

import {
  TWITTER_URL_BOOKMARKS,
  TWITTER_URL_EXPLORE,
  TWITTER_URL_HOME,
  TWITTER_URL_LOGIN,
  TWITTER_URL_LOGOUT,
  TWITTER_URL_MESSAGES,
  TWITTER_URL_NOTIFICATIONS,
  TWITTER_URL_SETTINGS,
  TWITTER_URL_TWEET
} from "../constants/urls";

export const goToHome = goTo(TWITTER_URL_HOME, {waitUntil: 'load'})
export const goToTweet = goTo(TWITTER_URL_TWEET, {waitUntil: 'load'})

export const goToExplore = goTo(TWITTER_URL_EXPLORE, {waitUntil: 'load'})
export const goToNotifications = goTo(TWITTER_URL_NOTIFICATIONS, {waitUntil: 'load'})
export const goToMessages = goTo(TWITTER_URL_MESSAGES, {waitUntil: 'load'})
export const goToBookmarks = goTo(TWITTER_URL_BOOKMARKS, {waitUntil: 'load'})
export const goToSettings = goTo(TWITTER_URL_SETTINGS, {waitUntil: 'load'})

export const goToLogin = goTo(TWITTER_URL_LOGIN)
export const goToLogout = goTo(TWITTER_URL_LOGOUT)
