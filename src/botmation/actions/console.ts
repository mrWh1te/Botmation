import { BotAction } from '../interfaces/bot-actions.interfaces'
import { logMessage, logWarning, logError, logPiped } from '../helpers/console'

/**
 * @description   The following Actions are specific to the NodeJS Console, for the Developer
 *                It's only about logging strings into the Console, with identifying coloring and spacing
 * 
 *                They will log piped values to the console AND carry piped values to the next BotAction (if passed)
 */

export const log = (message?: string): BotAction => async (page, ...injects: any[]) => {
  if (message) {
    logMessage(message)
  }

  // tmp solution / hacky fix
  if (injects.length > 0) {
    logPiped(injects[injects.length - 1]) // todo keep the piped value boxed so there is a way to check for some botactions who don't know what are their injects
  }

  // To put margin between this logged message in console and the next
  //  Warnings/Errors do not, to try and distinguish them with most recent logged message
  console.log('\n')

  // idea, maybe the ability to maintain the piped value should not be handled by the botactions, since we have clearPipe, we don't need the ability to not return a value = clears the pipe
  //    so maybe the pipe carries the piped value when the value returned is undefined (botaction:void)
  // probably will have to do this: const [test, {value}] = injects, when you want to use a piped value, when relying on it in a BotAction
  if (injects.length > 0) {
    return injects[injects.length - 1]
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
  