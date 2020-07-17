import { Page } from 'puppeteer'

import { BotAction } from '../interfaces/bot-actions.interfaces'
import { logError } from 'botmation/helpers/console'
import { injectsPipeOrEmptyPipe, wrapValueInPipe, injectsHavePipe } from 'botmation/helpers/pipe'
import { Pipe, PipeValue } from 'botmation/types/pipe'
 
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
  <R extends PipeValue = PipeValue, P = any>(page: Page, ...injects: any[]) =>
    async (...actions: BotAction<PipeValue|void>[]): Promise<Pipe<R>> => {
      // Possible for last inject to be the piped value
      let pipe = wrapValueInPipe()

      // in case we are used in a chain, injects won't have a pipe at the end
      if (injectsHavePipe(injects)) {
        pipe = injectsPipeOrEmptyPipe<P>(injects) // unwraps the piped value from the piped branded box
        injects = injects.slice(0, injects.length - 1)
      }

      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
      try {
        for(const action of actions) {
          const nextPipeValueOrVoid: PipeValue|any = await action(page, ...injects, pipe)
          
          // Bot Actions return the value removed from the pipe, and BotActionsPipe wraps it for injecting
          pipe = wrapValueInPipe(nextPipeValueOrVoid)
        }
      } catch(error) {
        logError(' -- PipeCaughtError -- ')
        logError(error)
      }

      return pipe as any as Pipe<R>
    }
