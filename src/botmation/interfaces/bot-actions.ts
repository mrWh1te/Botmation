import { Page } from 'puppeteer'

import { BotFilesInjects } from '../types/bot-files-injects'
import { BotIndexedDBInjects } from 'botmation/types/bot-indexed-db-injects'

/**
 * @description    All BotAction Interfaces (original chain link/pipeable, to more specific)
 */

/**
 * 
 */
export interface BotActionFactory<A extends Array<any> = any[], B = BotAction> extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: A) : B
}

/**
 * @description    BotAction Interface -> defaults to a chain (no resolved return value from the returned Promise<R>)
 */
export interface BotAction<R = void, I extends Array<any> = any[]> extends Function {
  (page: Page, ...injects: I) : Promise<R>
}

/**
 * @description   Is a BotAction that relies on Piping to return a boolean value
 *                    The boolean value is wrapped in a pipe, following the Pipe flow
 *                Instead this is for higher order bot actions or pipes as these return boolean values
 */
export interface ConditionalBotAction extends Function {
  (page: Page, ...injects: any[]) : Promise<boolean>
}

/**
 * @description    BotAction working with local files, use the same injects, therefore we strongly type the `injects` with that inject type
 *                 with a slightly more specific BotFilesAction interface (which fulfills the requirements of BotAction, but with greater specificity in the `injects`)
 */
export interface BotFilesAction<R = void, P = undefined> {
  (page: Page, ...injects: BotFilesInjects<P>) : Promise<R>
}

/**
 * 
 */
export interface BotIndexedDBAction<R = any, P = any> {
  (page: Page, ...injects: BotIndexedDBInjects<P>) : Promise<R>
}