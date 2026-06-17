import { Action } from "@botmation/v2core"

import { goTo } from '@botmation/puppeteer'

/**
 *
 */
export const goHome: Action =
  goTo('https://www.linkedin.com/', {waitUntil: 'domcontentloaded'})

/**
 *
 */
export const goToFeed: Action =
  goTo('https://www.linkedin.com/feed/', {waitUntil: 'domcontentloaded'})

/**
 *
 */
export const goToMessaging: Action =
  goTo('https://www.linkedin.com/messaging/', {waitUntil: 'domcontentloaded'})

/**
 *
 */
export const goToNotifications: Action =
  goTo('https://www.linkedin.com/notifications/', {waitUntil: 'domcontentloaded'})
