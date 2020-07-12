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
export interface BotFilesAction<R = void> {
  (page: Page, ...injects: BotFilesInjects) : Promise<R>
}
export interface BotFilesPipedAction<R = void, P = undefined> {
  (page: Page, piped: Piped<P>, ...injects: BotFilesInjects) : Promise<R>
}


//
// new gen idea
//
/**
 * @description   now piped is completely optional from typing, and can be skipped for BotFilesActions ! who uses not piped values, but injects for files config
 */
export type BotPipeInjects<P> = [Piped<P>, ...any[]]

// IndexedDB typing concept
// type IndexedDBDatabaseName = string
// type IndexedDBDatabaseVersion = number
// type IndexedDBStoreName = string
// type IndexedDBStoreNameKey = string
// type IndexedDBStoreNameKeyValue = any
// does this work, even with the spreading of BotPipeInjects<P> 2nd part ...any[] ? does that confused the IndexedDBDatabaseName placement in array?
// type BotIndexedDBInjects<P> = [...BotPipeInjects<P>, IndexedDBDatabaseName, IndexedDBDatabaseVersion, IndexedDBStoreName, IndexedDBStoreNameKey, IndexedDBStoreNameKeyValue]

export interface BotPipeAction<R = undefined, P = undefined> extends Function {
  (page: Page, ...injects: BotPipeInjects<P>) : Promise<R>,
  pipeable: boolean // true
}

// (page: Page, injects_0: string | undefined, ...injects_1: any[]): Promise<string>

// type BotActionArgs = [Page, ...any[]]


export type AnyBotAction = BotAction5|BotPipeAction|BotFilesAction

export interface BotActionFactory5<A extends Array<any> = any[], R = void, B = BotAction5<R>> extends Function {
  // Higher-Order Function (Factory) to Produce an Async Function (Returns Promise to be awaited)
  (...args: A) : B,
  pipeable?: boolean
}
export interface BotAction5<R = void> extends Function {
  (page: Page, ...injects: any[]) : Promise<R>
} // default is a regular (no custom type) chain-link, non-returning, non-piping, BotAction

// idea.... 
// curious how this will play out in IndexedDB(dbName, dbVersion, storeName?)(...botActions) // for injecting those 3 values into those bot actions
export interface BotInjects {
  [index: number] : any
  piped? : any
}
let injectsTest: BotInjects = []
injectsTest.piped = 5
export interface BotAction6<R = void> extends Function {
  (page: Page, ...injects: BotInjects[]) : Promise<R>
}
const testAction6: BotAction6 = async(page, injectsTest) => {}

/**
 * higher order function returns higher order function that will return a BotAction function
 */
export const createBotActionFactory = 
  <A extends Array<any> = any[], R = void, B = BotAction5<R>> (botActionFactory: BotActionFactory5<A, R, B>, pipeable: boolean = false): BotActionFactory5<A, R, B> => {
    botActionFactory.pipeable = pipeable
    return (...args: A) => botActionFactory(...args)
  }

/**
 * 
 * @param botAction 
 * @param pipeable 
 */
export const createBotAction = <R = void, B extends BotAction5<R> = BotAction5<R>>(botAction: BotAction5<R>, pipeable: boolean = false): B => {
    

    if (pipeable) {
      botAction.pipeable = true
    }

    return botAction
  }

export const createBotPipeAction = <R = void, P = undefined>(botAction: BotAction5<R>): BotPipeAction<R, P> => {
  botAction.pipeable = true
  return botAction as BotPipeAction<R, P>
}

// idea going forward, BotAction5 to become BotAction
// get rid of all Bot"Pipe"Action(s), get rid of `pipeable` because pipes will always pipe and actionsBase (conditional) may and thats okay Because
//    piped is going to the end of the injects ie type injects = [...any, Piped])
//    so building a BotAction without the intent of using piped values will NOT break its code in a pipe
//      therefore no action branding, but can support advanced action interfaces for stronger typing of injects like BotFilesAction, BotIndexedDBAction, etc
//    May or may not use some kind of createBotActionFactory() / createBotAction() helper methods, since in Factory it does give helpful inference of typing for auto-completion