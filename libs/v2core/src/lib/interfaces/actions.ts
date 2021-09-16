import { Page } from 'puppeteer'

import { BotFilesInjects } from '../types/bot-files-inject'
import { BotIndexedDBInjects } from '../types/bot-indexed-db-inject'
import { ScraperBotInjects } from '../types/scraper-bot-injects'
import { AbortLineSignal } from '../types/abort-line-signal'
import { Injects, PipeValue } from '../types'

/**
 * @description    All BotAction Interfaces
 *                 This project is centered on async functions called BotAction's
 *
 *                 The base interface for a `BotAction` is below
 *
 *                 There are higher order functions that return `BotAction`'s called `BotActionFactory`'ies
 *
 *                 The default nature of a BotAction (without having specific generics applied) is a function that returns a Promise whose value is void
 *                    In the case of using async/await, that amounts to these async functions that don't return anything. They are considered links in a chain.
 *                    They are resolved one at a time, and are each provided, at the very least, one Page from Puppeteer.
 *
 *                    Now it's possible for a BotAction async function to return a value. But, to access that value, in the next BotAction, they must be ran inside a pipe()()
 *                    Only in a pipe()(), will the returned value of the last BotAction be injected at the end, wrapped in a Pipe object.
 *
 *                 There are advanced BotAction's that support piping data, or have a more specific set of behavior like `injects` or return type.
 *                 These include ConditionalBotAction, BotFilesAction, and BotIndexedDBAction
 */

/**
 * @description    Action is an async Function whose default nature is to return a Promise<undefined>, but can be set to return a value
 */
export interface Action<I extends Injects = {}, R = AbortLineSignal|PipeValue|void> extends Function {
  (injects?: I) : Promise<R>
}

/**
 * @description    Higher-Order BotAction Functions that return BotAction's
 *                 Helpful for adding a layer of customization to a BotAction through dynamic scoping
 */
export interface ActionFactory<I extends {} = {}, B = Action> extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (args: I) : B
}

/**
 * @description   Is an advanced BotAction that returns a boolean value
 *                Useful in the higher order BotAction `givenThat()()` in providing a BotAction test as to whether or not run the following actions
 */
export interface ConditionalAction extends Function {
  (page: Page, ...injects: any[]) : Promise<boolean|AbortLineSignal>
}

/**
 * @description    Specifies BotFilesInjects as its injects
 *                 BotFilesInjects are safely injected by the higher order files()() BotAction
 */
export interface FilesAction<R = void|AbortLineSignal> {
  (page: Page, ...injects: BotFilesInjects) : Promise<R>
}

/**
 * @description    Specifies BotIndexedDBInjects as its injects
 *                 BotIndexedDBInjects are safely injected by the higher order indexedDBStore()() BotAction
 */
export interface IndexedDBAction<R = any> {
  (page: Page, ...injects: BotIndexedDBInjects) : Promise<R>
}

