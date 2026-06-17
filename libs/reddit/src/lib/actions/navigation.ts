import { goTo } from "@botmation/puppeteer";

import {
  REDDIT_URL_ALL,
  REDDIT_URL_BASE,
  REDDIT_URL_COINS,
  REDDIT_URL_CREATEAPOST,
  REDDIT_URL_CREATECOMMUNITY,
  REDDIT_URL_LOGIN,
  REDDIT_URL_MESSAGES_ALL,
  REDDIT_URL_MESSAGES_COMMENTREPLIES,
  REDDIT_URL_MESSAGES_MESSAGES,
  REDDIT_URL_MESSAGES_POSTREPLIES,
  REDDIT_URL_MESSAGES_SENT,
  REDDIT_URL_MESSAGES_UNREAD,
  REDDIT_URL_MESSAGES_USERNAMEMENTIONS,
  REDDIT_URL_NOTIFICATIONS,
  REDDIT_URL_ONEREDDIT_BASE,
  REDDIT_URL_POPULAR,
  REDDIT_URL_PREMIUM,
  REDDIT_URL_SETTINGS,
  REDDIT_URL_TOPCOMMUNITIES
} from "../constants/urls";

export const goToHome = goTo(REDDIT_URL_BASE, {waitUntil: 'load'})
export const goToPopular = goTo(REDDIT_URL_POPULAR, {waitUntil: 'load'})
export const goToAll = goTo(REDDIT_URL_ALL, {waitUntil: 'load'})
/**
 * @param subredditURLExtension ie 'AskReddit' => reddit.com/r/AskReddit/
 */
export const goToSubReddit = (subredditURLExtension: string) => goTo(REDDIT_URL_ONEREDDIT_BASE + subredditURLExtension, {waitUntil: 'load'})
export const goToTopCommunities = goTo(REDDIT_URL_TOPCOMMUNITIES, {waitUntil: 'load'})
export const goToNotifications = goTo(REDDIT_URL_NOTIFICATIONS, {waitUntil: 'load'})
export const goToSettings = goTo(REDDIT_URL_SETTINGS, {waitUntil: 'load'})
export const goToCreateAPost = goTo(REDDIT_URL_CREATEAPOST, {waitUntil: 'load'})
export const goToCreateCommunity = goTo(REDDIT_URL_CREATECOMMUNITY, {waitUntil: 'load'})
export const goToCoins = goTo(REDDIT_URL_COINS, {waitUntil: 'load'})
export const goToPremium = goTo(REDDIT_URL_PREMIUM, {waitUntil: 'load'})

export const goToMessagesAll = goTo(REDDIT_URL_MESSAGES_ALL, {waitUntil: 'load'})
export const goToMessagesUnread = goTo(REDDIT_URL_MESSAGES_UNREAD, {waitUntil: 'load'})
export const goToMessagesMessages = goTo(REDDIT_URL_MESSAGES_MESSAGES, {waitUntil: 'load'})
export const goToMessagesSent = goTo(REDDIT_URL_MESSAGES_SENT, {waitUntil: 'load'})
export const goToMessagesCommentReplies = goTo(REDDIT_URL_MESSAGES_COMMENTREPLIES, {waitUntil: 'load'})
export const goToMessagesPostReplies = goTo(REDDIT_URL_MESSAGES_POSTREPLIES, {waitUntil: 'load'})
export const goToMessagesUsernameMentions = goTo(REDDIT_URL_MESSAGES_USERNAMEMENTIONS, {waitUntil: 'load'})

export const goToLogin = goTo(REDDIT_URL_LOGIN, {waitUntil: 'load'})
