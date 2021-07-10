import { Action } from '../interfaces/actions'
import { logMessage, logWarning, logError, logPipeValue } from '../helpers/console'
import { injectsValue } from '../types'

/**
 * @description   The following Actions are specific to the NodeJS Console, intended for the Developer.
 *                It focuses on logging strings into the Console, with identifying themes in an unified format.
 *
 *                If used in a Pipe, it will
 *                  1) print to the console the piped value
 *                  2) automatically return the Pipe value to continue it on to the next Action
 *                      ^maintains the value in the Pipe, by carrying it forward through returning it
 */

/**
 * @description   Log a successfully themed string and its Piped value if there is a Pipe
 *                Forwards any Pipe value received by returning it
 * @param message
 */
export const log = (message?: string): Action<Partial<injectsValue>> => async ({value}) => {
  if (message) {
    logMessage(message)
  }

  if (value) {
    logPipeValue(value)
    console.log('\n')

    return value
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
export const warning = (warningMessage?: string): Action<Partial<injectsValue>> => async ({value}) => {
  if (warningMessage) {
    logWarning(warningMessage)
  }

  if (value) {
    logPipeValue(value)
    return value
  }
}

/**
 * @description   Log an error themed string and its Piped value if there is a Pipe
 *                Forwards any Pipe value received by returning it
 * @param message
 */
export const error = (errorMessage?: string): Action<Partial<injectsValue>> => async ({value}) => {
  if (errorMessage) {
    logError(errorMessage)
  }

  if (value) {
    logPipeValue(value)
    return value
  }
}
