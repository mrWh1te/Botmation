import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { logError } from 'botmation/helpers/console'
import { injectsPipeOrEmptyPipe, wrapValueInPipe, injectsHavePipe } from 'botmation/helpers/pipe'
import { Pipe, isPipe } from 'botmation/types/pipe'

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
      let pipe = undefined

      // in case we are used in a chain, injects won't have a pipe at the end
      if (injectsHavePipe(injects)) {
        pipe = injectsPipeOrEmptyPipe<P>(injects) // unwraps the piped value from the piped branded box
        injects = injects.slice(0, injects.length - 1)
      }

      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
      try {
        for(const action of actions) {
          // it's possible for a bot action to be a pipe using the pipe()() botaction, so if that is the case, it's actually resolving a Pipe, not a value like a regular botaction
          const nextPipeOrPipeValue: Pipe|any = await action(page, ...injects, pipe) // if action doesn't return anything, is this value === undefined !?!?!?! TODO test this
          
          // so if it's a pipe
          if (isPipe(nextPipeOrPipeValue)) {
            pipe = nextPipeOrPipeValue
          } else {
            // if it's not a pipe, then wrap the value in a pipe
            pipe = wrapValueInPipe(nextPipeOrPipeValue)
          }
        }
      } catch(error) {
        logError('PipeCaughtError:')
        logError(error)
      }

      console.log('[BotActionsPipe] returning this pipe = ', pipe)
      
      return pipe as any as Pipe<R>
    }
