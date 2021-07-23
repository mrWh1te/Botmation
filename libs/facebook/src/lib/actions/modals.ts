import { Action } from "@botmation/v2core";

import { click, elementExists } from '@botmation/puppeteer'

// Push Notifications Request
export const isPushNotificationsRequestVisible: Action =
  elementExists('div[aria-label="Push notifications request"]')

export const closeModal: Action =
  click('body')
