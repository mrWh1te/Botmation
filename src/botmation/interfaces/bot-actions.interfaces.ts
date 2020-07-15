import { Page } from 'puppeteer'

import { BotFileOptions } from './bot-file-options.interfaces'
import { PipedValue } from '../types/piped'
import { BotFilesInjects } from '../types/bot-files-injects'

/**
 * @description    All BotAction Interfaces (original chain link/pipeable, to more specific)
 */

/**
 * 
 */
export type BotInjects = any[]


/**
 * @description   Base Interface for the Higher-Order Action implementations to enable IDE assistance, strong type checking, etc
 * @deprecated
 */
export interface BotActionFactory<R> extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: any[]) : BotAction<R, any|undefined>
}

/**
 * R = return (default is void)
 * P = piped (default is undefined)
 *  Defaults set it to a link in the chain (not pipeable botaction, so no `piped` and no return value to resolve)
 * @deprecated
 */
export interface BotAction<R = void, P = undefined> extends Function {
  (page: Page, piped: PipedValue<P>, options: BotFileOptions, ...injects: BotInjects) : Promise<R>
}

// hmmm......
// Generic `injects`, but can be overloaded with more specific interface ie BotOutputActions

// what are BotOptions used for, what are they reserved to be used for, and is that needed for the majority of BotAction's?
// maybe options: BotOptions is an inject that a BotAction specifies instead of ALWAYS being first inject when injects present?

// TODO test injecting an instance of a class that is used by actions to set/get data, then log
// determine if the `injects` concept is worth keeping

/**
 * @description   Like a BotAction, but it's not mean't to be used within a chain of Bot Action's
 *                Instead this is for higher order bot actions or pipes as these return boolean values
 */
export interface ConditionalBotAction extends Function {
  (page: Page, ...injects: any[]) : Promise<boolean>
}

/**
 * @description    BotAction working with local files, use the same inject, therefore we strongly type the `injects` with that inject type
 *                 with a slightly more specific BotFilesAction interface (which fulfills the requirements of BotAction, but with greater specificity in the `injects`)
 */
export interface BotFilesAction<R = void, P = undefined> {
  (page: Page, ...injects: BotFilesInjects<P>) : Promise<R>
}

//
// IndexedDB
export type IndexedDBDatabaseName = string
export type IndexedDBDatabaseVersion = number
export type IndexedDBStoreName = string
export type IndexedDBStoreNameKey = string
export type IndexedDBStoreNameKeyValue = any
/**
 * @description   [databaseName, databaseVersion, storeName, and Piped value]
 */
export type BotIndexedDBInjects<P> = [IndexedDBDatabaseName, IndexedDBDatabaseVersion, IndexedDBStoreName, PipedValue<P>]

/**
 * 
 */
export interface BotIndexedDBAction<R = void, P = undefined> {
  (page: Page, injects: BotIndexedDBInjects<P>) : Promise<R>
}


//
// now-gen
export type AnyBotAction = BotAction5|BotFilesAction

export interface BotActionFactory5<A extends Array<any> = any[], B = BotAction5> extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: A) : B
}
export interface BotAction5<R = any, I extends Array<any> = any[]> extends Function {
  (page: Page, ...injects: I) : Promise<R>
}