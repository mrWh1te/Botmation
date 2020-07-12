import { Page } from 'puppeteer'
import { BotOptions } from './bot-options.interfaces'

/**
 * 
 */
export type injects = any[]
export type piped<T> = T|undefined

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
  (page: Page, piped: piped<P>, options: BotOptions, ...injects: injects) : Promise<R>
}

// hmmm......
export type injects2 = [BotOptions, ...any[]]
export interface BotAction3<R = void, P = undefined> extends Function {
  (page: Page, piped?: piped<P>, ...injects: injects2) : Promise<R>
}

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