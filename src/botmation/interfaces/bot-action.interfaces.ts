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
 *                Instead this is for some higher order bot actions that require a condition ie givenThat, forAll
 */
export interface ConditionalBotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<boolean>
}