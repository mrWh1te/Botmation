import { Page } from 'puppeteer'

import { BotAction5, BotAction } from '../interfaces/bot-actions.interfaces'
import { BotFileOptions } from '../interfaces/bot-options.interfaces'
import { PipedValue, isPipedValue, Piped } from '../types/piped'
import { getDefaultBotFileOptions } from '../helpers/file-options'
import { logError } from 'botmation/helpers/console'

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
// new gen
//   should a pipe be a self-enclosed chain-link? Nothing goes in, nothing is returned?
//   we can create special botActions for plugging in data like tap() // which pipes whatever it's given to the next bot action
//
// if a pipe can return something and pass in stuff, then pipes can be "piped" in sequence..... is that good/bad?
//    could it create inner pipe depedencies in terms of sequence, etc ?
//
export const BotActionsPipeFactory5 = 
  <R = undefined, P = undefined>(page: Page, ...injects: any[]) => // overloadOptions: Partial<BotOptions> = {}
    async (...actions: BotAction5[]): Promise<void|Piped<R>> => {
      // Possible for last inject to be the piped value
      let piped = injectsPipedValueOrUndefined<P>(injects) // unwraps the piped value from the piped branded box

      // let piped // pipe's are closed chain-links, so nothing pipeable comes in, so data is grabbed in a pipe and shared down stream a pipe, and returns
      try {
        for(const action of actions) {
          piped = await action(page, ...injects, piped)
        }
      } catch(error) {
        logError('PipeCaughtError:')
        logError(error)
      }

      // Return of an ActionsPipe is `void` unless the last action returns something
      // if it returns something, it's the last piped value returned from the last botaction, wrapped for type gaurding:
      if (piped) {
        return {
          brand: 'piped',
          value: piped
        } as any as Piped<R>
      }

    }

    // maybe in actions factories, we flip the order of where the `piped` param is passed ? always assume it, with default undefined

//
// @todo move to helpers for pipe functionality
// @description     Returns a Piped Value, if found in the Injects array, otherwise returns undefined
const injectsPipedValueOrUndefined = <P = any>(injects: any[]): P =>
  injects.length > 0 && isPipedValue(injects[injects.length - 1]) ? injects[injects.length - 1].value : undefined