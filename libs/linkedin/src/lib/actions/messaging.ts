import { BotAction, click } from '@botmation/core'
import { messagingOverlayHeaderSelector } from '../selectors'

/**
 *
 */
export const toggleMessagingOverlay: BotAction =
  click(messagingOverlayHeaderSelector)
