import { BotAction } from '../interfaces/bot-action.interfaces'
import { logMessage, logWarning, logError } from '../helpers/console'

/**
 * @description   The following Actions are specific to the Console, for the Developer
 *                It's only about logging strings into the Console, with some kind of coloring
 */

//
// Actions
export const log = (message: string): BotAction => async() =>
  logMessage(message)

export const warning = (warning: string): BotAction => async () =>
  logWarning(warning)

export const error = (error: string): BotAction => async () =>
  logError(error)