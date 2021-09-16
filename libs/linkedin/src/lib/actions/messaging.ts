import { Action } from '@botmation/v2core'
import { click } from '@botmation/puppeteer'

import { messagingOverlayHeaderSelector } from '../selectors'

/**
 *
 */
export const toggleMessagingOverlay: Action =
  click(messagingOverlayHeaderSelector)
