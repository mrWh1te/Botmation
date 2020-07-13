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
export type BotInjects = any[]


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
  (page: Page, piped: Piped<P>, options: BotOptions, ...injects: BotInjects) : Promise<R>
}

// hmmm......
// Generic `injects`, but can be overloaded with more specific interface ie BotOutputActions

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
export type BotIndexedDBInjects<P> = [IndexedDBDatabaseName, IndexedDBDatabaseVersion, IndexedDBStoreName, Piped<P>]

/**
 * 
 */
export interface BotIndexedDBAction<R = void, P = undefined> {
  (page: Page, injects: BotIndexedDBInjects<P>) : Promise<R>
}

/**
 * concept
 * @description   Typable way to have advanced bot actions w/ custom injects
 */
export interface BotAction10<R = void, I extends BotInjects = BotInjects> {
  (page: Page, ...injects: I) : Promise<R>
}

//
// new gen idea
//
/**
 * @description   now piped is completely optional from typing, and can be skipped for BotFilesActions ! who uses not piped values, but injects for files config
 */
// export type BotPipeInjects<P> = [Piped<P>, ...any[]] // doing a piped inject at end, not to break custom BotActions written to work without it

// IndexedDB typing concept



// type BotActionArgs = [Page, ...any[]]





//
// new-gen
export type AnyBotAction = BotAction5|BotFilesAction

export interface BotActionFactory5<A extends Array<any> = any[], R = void, B = BotAction5<R>> extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: A) : B
}
export interface BotAction5<R = void> extends Function {
  (page: Page, ...injects: any[]) : Promise<R>
} // default is a regular (no custom type) chain-link, non-returning, non-piping, BotAction




// curious how this will play out in IndexedDB(dbName, dbVersion, storeName?)(...botActions) // for injecting those 3 values into those bot actions


/**
 * higher order function returns higher order function that will return a BotAction function
 */
export const createBotActionFactory = 
  <A extends Array<any> = any[], R = void, B = BotAction5<R>> (botActionFactory: BotActionFactory5<A, R, B>, pipeable: boolean = false): BotActionFactory5<A, R, B> => 
    (...args: A) => botActionFactory(...args)
  

/**
 * 
 * @param botAction 
 * @param pipeable 
 */
// export const createBotAction = <R = void, B extends BotAction5<R> = BotAction5<R>>(botAction: BotAction5<R>, pipeable: boolean = false): B => {
    

//     return botAction
//   }



// idea going forward, BotAction5 to become BotAction
// get rid of all Bot"Pipe"Action(s), get rid of `pipeable` because pipes will always pipe and actionsBase (conditional) may and thats okay Because
//    piped is going to the end of the injects ie type injects = [...any, Piped])
//    so building a BotAction without the intent of using piped values will NOT break its code in a pipe
//      therefore no action branding, but can support advanced action interfaces for stronger typing of injects like BotFilesAction, BotIndexedDBAction, etc
//    May or may not use some kind of createBotActionFactory() / createBotAction() helper methods, since in Factory it does give helpful inference of typing for auto-completion