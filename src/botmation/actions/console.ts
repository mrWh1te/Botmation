import { BotAction } from '../interfaces/bot-actions'
import { logMessage, logWarning, logError, logPipeValue } from '../helpers/console'
import { injectsHavePipe, getInjectsPipeValue } from 'botmation/helpers/pipe'

/**
 * @description   The following Actions are specific to the NodeJS Console, for the Developer
 *                It's only about logging strings into the Console, with identifying coloring and spacing
 * 
 *                If used in a Pipe, it will 
 *                  1) print to the console the piped value
 *                  2) automatically return it
 *                      ^this maintains it in the pipe, unlike regular pipable bot actions, which usually don't return the piped value received (carrying it forward)
 */

export const log = (message?: string): BotAction<any> => async (page, ...injects) => {
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
    //  Warnings/Errors do not, to try and distinguish them with most recent logged message
    console.log('\n')
  }
}

export const warning = (warning?: string): BotAction<any> => async (page, ...injects) => {
  if (warning) {
    logWarning(warning)
  }

  if (injectsHavePipe(injects)) {
    let pipedValue = getInjectsPipeValue(injects)

    logPipeValue(pipedValue)
    return pipedValue
  }
}

export const error = (error?: string): BotAction<any> => async (page, ...injects) => {
  if (error) {
    logError(error)
  }

  if (injectsHavePipe(injects)) {
    let pipedValue = getInjectsPipeValue(injects)

    logPipeValue(pipedValue)
    return pipedValue
  }
}