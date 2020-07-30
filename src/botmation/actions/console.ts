import { BotAction } from '../interfaces/bot-actions'
import { logMessage, logWarning, logError, logPipeValue } from '../helpers/console'
import { injectsHavePipe, getInjectsPipeValue } from '../helpers/pipe'

/**
 * @description   The following Actions are specific to the NodeJS Console, intended for the Developer.
 *                It focuses on logging strings into the Console, with identifying themes in an unified format.
 * 
 *                If used in a Pipe, it will 
 *                  1) print to the console the piped value
 *                  2) automatically return the Pipe value to continue it on to the next BotAction
 *                      ^maintains the value in the Pipe, by carrying it forward through returning it
 */

/**
 * @description   Log a successfully themed string and its Piped value if there is a Pipe
 *                Forwards any Pipe value received by returning it
 * @param message 
 */
export const log = <R = void>(message?: string): BotAction<R> => async (page, ...injects) => {
  if (message) {
    logMessage(message)
  }

  if (injectsHavePipe(injects)) {
    let pipedValue = getInjectsPipeValue(injects)
    logPipeValue(pipedValue)
    console.log('\n')
    
    return pipedValue
  } else {
     // To put margin between this logged message in console and the next
    //  Increase log read-ability
    console.log('\n')
  }
}

/**
 * @description   Log a warning themed string and its Piped value if there is a Pipe
 *                Forwards any Pipe value received by returning it
 * @param message 
 */
export const warning = <R = void>(warning?: string): BotAction<R> => async (page, ...injects) => {
  if (warning) {
    logWarning(warning)
  }

  if (injectsHavePipe(injects)) {
    let pipedValue = getInjectsPipeValue(injects)

    logPipeValue(pipedValue)
    return pipedValue
  }
}

/**
 * @description   Log an error themed string and its Piped value if there is a Pipe
 *                Forwards any Pipe value received by returning it
 * @param message 
 */
export const error = <R = void>(error?: string): BotAction<R> => async (page, ...injects) => {
  if (error) {
    logError(error)
  }

  if (injectsHavePipe(injects)) {
    let pipedValue = getInjectsPipeValue(injects)

    logPipeValue(pipedValue)
    return pipedValue
  }
}