import { BotAction } from '../interfaces/bot-actions.interfaces'
import { logMessage, logWarning, logError, logPiped } from '../helpers/console'

/**
 * @description   The following Actions are specific to the NodeJS Console, for the Developer
 *                It's only about logging strings into the Console, with identifying coloring and spacing
 * 
 *                They will log piped values to the console AND carry piped values to the next BotAction (if passed)
 */

export const log = (message?: string): BotAction => async (page, piped) => {
  if (message) {
    logMessage(message)
  }

  if (piped) {
    logPiped(piped)
  }

  // To put margin between this logged message in console and the next
  //  Warnings/Errors do not, to try and distinguish them with most recent logged message
  console.log('\n')

  if (piped) {
    return piped
  }
}

export const warning = (warning?: string): BotAction => async (page, piped) => {
  if (warning) {
    logWarning(warning)
  }

  if (piped) {
    logPiped(piped)
    return piped
  }
}

export const error = (error?: string): BotAction => async (page, piped) => {
  if (error) {
    logError(error)
  }

  if (piped) {
    logPiped(piped)
    return piped
  }
}
  