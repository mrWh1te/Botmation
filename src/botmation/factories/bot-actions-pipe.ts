import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { logError } from 'botmation/helpers/console'
import { injectsPipeOrEmptyPipe, wrapValueInPipe } from 'botmation/helpers/pipe'
import { Pipe } from 'botmation/types/pipe'

//
// Standards
 
//
/**
 * @description     A chain-link that acts like a pipe
 *   Rules:
 *      1) Pipes always inject a pipeable value at the end
 *      2) A piped value is always wrapped with branding, in case the number of injects is unknown
 *      3) A Bot action that does not return a value, in a pipe, effectively clears the piped value
 *      4) A cleared pipe is a piped value as undefined (so you get a piped branded object, with its `value` property = undefined)
 *      5) Pipes expect piped values to come in to their pipe, but have safe defaults if they don't
 *      7) Piped always return their piped values in the end (so if empty pipe, undefined, otherwise whatever the value, branded is)
 * @param page 
 * @param injects 
 */
export const BotActionsPipe = 
  <R = any, P = any>(page: Page, ...injects: any[]) =>
    async (...actions: BotAction[]): Promise<Pipe<R>> => {
      // Possible for last inject to be the piped value
      let pipe = injectsPipeOrEmptyPipe<P>(injects) // unwraps the piped value from the piped branded box

      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
      try {
        for(const action of actions) {
          const nextPipedValue = await action(page, ...injects, pipe) // if action doesn't return anything, is this value === undefined !?!?!?! TODO test this

          pipe = wrapValueInPipe(nextPipedValue)
        }
      } catch(error) {
        logError('PipeCaughtError:')
        logError(error)
      }

      return pipe as any as Pipe<R>
    }
