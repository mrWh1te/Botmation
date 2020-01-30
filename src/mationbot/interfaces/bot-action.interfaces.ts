import { Page } from 'puppeteer'

/**
 * @description   Base Interface for the Higher-Order Action implementations to enable IDE assistance, strong type checking, etc
 */
export interface BotActionFactory extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: any[]) : BotAction
}

export interface BotAction extends Function {
  (page: Page) : Promise<void> // async function for pupeeteer manipulation of page, sequentially
}