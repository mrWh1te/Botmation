import { BotAction } from '../interfaces/bot-action.interfaces'
import { logMessage, logWarning, logError } from '../helpers/console'

/**
 * @description   The following Actions are specific to the NodeJS Console, for the Developer
 *                It's only about logging strings into the Console, with identifying coloring and spacing
 */

export const log = (message: string): BotAction<void> => async() =>
  logMessage(message)

export const warning = (warning: string): BotAction<void> => async () =>
  logWarning(warning)

export const error = (error: string): BotAction<void> => async () =>
  logError(error)