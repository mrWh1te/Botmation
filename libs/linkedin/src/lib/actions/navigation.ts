import { BotAction, goTo } from "@botmation/core"

/**
 *
 */
export const goHome: BotAction =
  goTo('https://www.linkedin.com/', {waitUntil: 'domcontentloaded'})

/**
 *
 */
export const goToFeed: BotAction =
  goTo('https://www.linkedin.com/feed/', {waitUntil: 'domcontentloaded'})

/**
 *
 */
export const goToMessaging: BotAction =
  goTo('https://www.linkedin.com/messaging/', {waitUntil: 'domcontentloaded'})

/**
 *
 */
export const goToNotifications: BotAction =
  goTo('https://www.linkedin.com/notifications/', {waitUntil: 'domcontentloaded'})
