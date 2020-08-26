import { BotAction, goTo } from "../../.."

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