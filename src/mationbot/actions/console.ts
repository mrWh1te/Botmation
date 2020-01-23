import chalk from 'chalk'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'

// Chalk Themes
const logTheme = chalk.bgGreen;
const warningTheme = chalk.bgYellow
const errorTheme = chalk.bgRed

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

//
// helpers
/**
 * @description  Reusable form of these functions that are not factory methods, to be reused in other parts of the code, outside actions(), for same logging format
 * @param message 
 */
export const logMessage = (message: string) => 
  console.log(
    logTheme(appendGutter(' Log:', 5)) + prependGutter(message, 1)
  )
export const logWarning = (warning: string) => 
  console.log(
    warningTheme(' Warning: ') + prependGutter(warning, 1)
  )
export const logError = (error: string) =>
  console.log(
    errorTheme(appendGutter(' Error:', 3)) + prependGutter(error, 1)
  )

/**
 * @description   Keep the actual console message right-aligned with other logged messages
 * @param copy 
 * @param size 
 */
const prependGutter = (copy: string, size: number = 0): string => {
  if (!size) {
    return copy
  }

  let gutter = ''
  for(let i = 0; i < size; i++) {
    gutter += ' '
  } 

  return gutter + copy
}
const appendGutter = (copy: string, size: number = 0): string => {
  if (!size) {
    return copy
  }

  let gutter = ''
  for(let i = 0; i < size; i++) {
    gutter += ' '
  } 

  return copy + gutter
}