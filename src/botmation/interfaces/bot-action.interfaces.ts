import { Page } from 'puppeteer'
import { BotOptions } from './bot-options.interfaces'

/**
 * @description   Base Interface for the Higher-Order Action implementations to enable IDE assistance, strong type checking, etc
 */
export interface BotActionFactory extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: any[]) : BotAction
}

export interface BotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<void> // async function for pupeeteer manipulation of page, sequentially
}

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


export interface BotPipeActionFactory<T> extends Function {
  (...args: any[]) : BotPipeAction<T>
}

export interface BotPipeAction<T> extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<T>
}