import { Page } from "puppeteer"

import { ConditionalBotAction } from "../../../interfaces"

/**
 * @description   Instagram will show a special block when a User scrolls to the "bottom" of their "endless" feed
 *                The "bottom" is recognized as the end of "unread" content. Therefore, a good signal to stop consuming the feed,
 *                otherwise, risk processing previously processed content.
 */
export const feedIsntAtBottom: ConditionalBotAction = async(page) => {


  return true
}

// what if create special BotActionsPipeFactory to pipe indexDB data