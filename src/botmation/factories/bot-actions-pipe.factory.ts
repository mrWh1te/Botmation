import { Page } from 'puppeteer'

import { BotAction5, BotAction } from '../interfaces/bot-actions.interfaces'
import { BotFileOptions } from '../interfaces/bot-file-options.interfaces'
import { PipedValue, Piped } from '../types/piped'
import { getDefaultBotFileOptions } from '../helpers/file-options'
import { logError } from 'botmation/helpers/console'
import { injectsPipeOrEmptyPipe, wrapValueInPipe } from 'botmation/helpers/pipe'

/**
 * @description   Similar to BotActionsChainFactory except the output of BotAction's are provided as input for subsequent BotAction's
 *                This can be used within a regular BotActionsChain like forAsLong(reading feed)(pipe the feed data through these special actions)
 * 
 *                Returned data of one botaction is appended to the end of the `injects` in the subsequent action
 *                Therefore, if a custom BotAction strongly types the injects, that isn't lost when used after another BotAction that returns a value
 * 
 * @param page    Puppeteer.Page
 */
export const BotActionsPipeFactory = 
  <R = undefined, P = undefined>(page: Page, piped?: PipedValue<P>, overloadOptions: Partial<BotFileOptions> = {}, ...injects: any[]) => 
    async (...actions: BotAction<any>[]): Promise<R> => {
      let piped = undefined

      for(const action of actions) {
        piped = await action(page, piped, getDefaultBotFileOptions(overloadOptions), ...injects)
      }

      return piped
    }

//
// Standards
//  1) Pipes always inject a pipeable value at the end
//  2) A piped value is always wrapped with branding, in case the number of injects is unknown
//  3) A Bot action that does not return a value, in a pipe, effectively clears the piped value
//  4) A cleared pipe is a piped value as undefined (so you get a piped branded object, with its `value` property = undefined)
//  5) Pipes expect piped values to come in to their pipe, but have safe defaults
//  7) Piped always return their piped values in the end (so if empty pipe, undefined, otherwise whatever the value, unbranded is)
//
export const BotActionsPipeFactory5 = 
  <R = any, P = any>(page: Page, ...injects: any[]) =>
    async (...actions: BotAction5[]): Promise<R> => {
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

      return pipe.value as any as R
    }
