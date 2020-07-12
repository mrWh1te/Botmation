import { Page } from 'puppeteer'

import { BotOptions } from './bot-options.interfaces'
import { Piped } from '../types/piped'
import { BotFilesInjects } from '../types/bot-files-injects'

/**
 * @description    All BotAction Interfaces (original chain link/pipeable, to more specific)
 */

/**
 * 
 */
export type injects = any[]


/**
 * @description   Base Interface for the Higher-Order Action implementations to enable IDE assistance, strong type checking, etc
 */
export interface BotActionFactory<R> extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: any[]) : BotAction<R, any|undefined>
}

/**
 * R = return (default is void)
 * P = piped (default is undefined)
 *  Defaults set it to a link in the chain (not pipeable botaction, so no `piped` and no return value to resolve)
 */
export interface BotAction<R = void, P = undefined> extends Function {
  (page: Page, piped: Piped<P>, options: BotOptions, ...injects: injects) : Promise<R>
}

// hmmm......
// Generic `injects`, but can be overloaded with more specific interface ie BotOutputActions
export interface BotAction3<R = void, P = undefined> extends Function {
  (page: Page, piped?: Piped<P>, ...injects: any[]) : Promise<R>
}
// what are BotOptions used for, what are they reserved to be used for, and is that needed for the majority of BotAction's?
// maybe options: BotOptions is an inject that a BotAction specifies instead of ALWAYS being first inject when injects present?

// TODO test injecting an instance of a class that is used by actions to set/get data, then log
// determine if the `injects` concept is worth keeping

/**
 * @description   Like a BotAction, but it's not mean't to be used within a chain of Bot Action's
 *                Instead this is for higher order bot actions that require a condition ie givenThat, forAll
 *                It's like a BotAction, given the method signature, but the return type of the Promise is different!
 * 
 *                Please don't use ConditionalBotAction's directly in sequence, they are to help higher order bot actions
 */
export interface ConditionalBotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<boolean>
}

/**
 * @description    BotAction working with local files, use the same inject, therefore we strongly type the `injects` with that inject type
 *                 with a slightly more specific BotFilesAction interface (which fulfills the requirements of BotAction, but with greater specificity in the `injects`)
 */
export interface BotFilesAction<R = void, P = undefined> {
  (page: Page, piped?: Piped<P>, ...injects: BotFilesInjects) : Promise<R>
}






export interface BotAction5<R = void, P = undefined> extends Function {
  (page: Page, ...injects: any[]) : Promise<R>
}

/**
 * @description   now piped is completely optional from typing, and can be skipped for BotFilesActions ! who uses not piped values, but injects for files config
 */
export type BotPipeInjects<P> = [Piped<P>, ...any[]]
type BotIndexedDBInjects<P> = [Piped<P>, string, number, string, string]

export interface BotPipeAction<R = undefined, P = undefined> extends Function {
  (page: Page, ...injects: BotPipeInjects<P>) : Promise<R>
}