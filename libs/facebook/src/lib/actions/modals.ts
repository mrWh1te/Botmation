import { BotAction, click, ConditionalBotAction, elementExists } from "@botmation/core";

// Push Notifications Request
export const isPushNotificationsRequestVisible: ConditionalBotAction =
  elementExists('div[aria-label="Push notifications request"]')

export const closeModal: BotAction =
  click('body')
