import { BotAction, click } from '../../..'
import { messagingOverlayHeaderSelector } from '../selectors'

/**
 * 
 */
export const toggleMessagingOverlay: BotAction =
  click(messagingOverlayHeaderSelector)