import { BotAction } from '../interfaces/bot-actions.interfaces'
import { logMessage, logWarning, logError, logPiped } from '../helpers/console'
import { injectsArePiped, getInjectsPipedValue } from 'botmation/helpers/pipe'

/**
 * @description   The following Actions are specific to the NodeJS Console, for the Developer
 *                It's only about logging strings into the Console, with identifying coloring and spacing
 * 
 *                If used in a Pipe, it will 
 *                  1) print to the console the piped value
 *                  2) automatically return it
 *                      ^this maintains it in the pipe, unlike regular pipable bot actions, which usually don't return the piped value received (carrying it forward)
 */

export const log = (message?: string): BotAction => async (page, ...injects) => {
  if (message) {
    logMessage(message)
  }

  if (injectsArePiped(injects)) {
    let pipedValue = getInjectsPipedValue(injects)
    logPiped(pipedValue)
    console.log('\n')
    return pipedValue

  } else {
     // To put margin between this logged message in console and the next
    //  Warnings/Errors do not, to try and distinguish them with most recent logged message
    console.log('\n')
  }
}

export const warning = (warning?: string): BotAction => async (page, ...injects) => {
  if (warning) {
    logWarning(warning)
  }

  if (injectsArePiped(injects)) {
    let pipedValue = getInjectsPipedValue(injects)

    logPiped(pipedValue)
    return pipedValue
  }
}

export const error = (error?: string): BotAction => async (page, ...injects) => {
  if (error) {
    logError(error)
  }

  if (injectsArePiped(injects)) {
    let pipedValue = getInjectsPipedValue(injects)

    logPiped(pipedValue)
    return pipedValue
  }
}