import { openDB } from 'idb'

import { BotAction, createBotActionFactory, BotAction10, BotIndexedDBInjects } from '../interfaces/bot-actions.interfaces'
import { logMessage } from 'botmation/helpers/console'
import { BotActionsPipeFactory } from 'botmation/factories/bot-actions-pipe.factory'

// ideas

// indexedDB(...BotActions) // PIPE!
// indexedDB(dbName, dbVersion, dbStore?)(
//   // all read/writes/deletes have supplied dbName, dbVersion, dbStore
//   // works like a pipe, so can mix BotAction's here, but with also those supplied injects (optional 3rd)
// )

// export const indexedDB = 
//   (databaseName: string, databaseVersion: number, storeName?: string) =>
//     (...actions: BotAction[]): BotAction => 
//       async(page, piped, options, ...injects) => 
//         await BotActionsPipeFactory(page, piped, options, ...injects)(...actions)
      

// consider dev use-cases:
//  1. Getting data to check if we are authenticated

export interface IndexedDBInfo {
  name: string
  version: number
}

// export type IndexedDBInjects = [number, string, string] // DataBaseVersion, DataBaseName, StoreName

/**
 * @description   Pipe-able BotAction (subsequent BotAction has the resolved data injected)
 *                Returns an array of all databases' info from IndexedDB
 * @param page 
 */
// export const getIndexedDBDatabasesInfo: BotAction<IndexedDBInfo[]> = async(page) => 
//   await page.evaluate(async() =>
//     await indexedDB.databases() // not in Interface, but Chrome 71 supports it
//   )

/**
 * @description   Pipe-able BotAction
 *                Returns an array of names of all the Stores found in the requested IndexedDB database
 * @param databaseName 
 * @param databaseVersion 
 */
export const getIndexedDBStoreNamesOf = (databaseName: string, databaseVersion: number): BotAction<string[]> => async(page) => 
  await page.evaluate(async() => 
    [...(await openDB(databaseName, databaseVersion)).objectStoreNames]
  )

export const pipeTest = (numberToPipeThrough: any): BotAction<number> => async() => numberToPipeThrough
    
export const getIndexedDBStorenames = (databaseName: string, databaseVersion: number): BotAction<string[]> => async(page) => {

  logMessage('getIndexedDBStorenames running')
  let x = 'no'
  let names: string[] = []

  await page.evaluate(() => {
    
    // if (window.indexedDB) {
      x = 'yes'
    // } else {
      // x = 'no'
    // }

    // names = await new Promise<string[]>(resolve => {
    //   if (window.indexedDB) {
    //     x = 'yes'
    //   } else {
    //     x = 'hell no'
    //   }
    //   return resolve(['testname'])
    //   // const openDBRequest = window.indexedDB.open(databaseName, databaseVersion)

    //   // openDBRequest.onerror = () => resolve([])  
    //   // openDBRequest.onsuccess = () => resolve([...openDBRequest.result.objectStoreNames])
    // })
    return x
  })

  logMessage('did we evaluate? ' + x)
  
  // await page.evaluate(async() => {
  //   logMessage('page evaluating!')

  //   if (window) {
  //     logMessage('have window!')
  //   } else {
  //     logError('no window!')
  //   }

  // const names = await new Promise<string[]>(async(resolve) => {
  
  //   console.log(idb ? 'idb is here' : 'idb is NOT here')

  //   const openDBRequest = idb.open(databaseName, databaseVersion)

  
  //   openDBRequest.onerror = () => resolve([])  
  //   openDBRequest.onsuccess = () => resolve([...openDBRequest.result.objectStoreNames])
  // })
  // })
  
  return names
}

/**
 * 
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 * @param value 
 */
export const setIDBKeyValue = createBotActionFactory(
  (databaseName: string, databaseVersion: number, storeName: string, key: string, value: any) => async(page) => {
    await page.evaluate(setIndexedDBStoreValue, databaseName, databaseVersion, storeName, key, value)
  }
)

/**
 * new-gen
 * @description    Supports setting the 'key' and/or 'value' from `pipedValue` 
 *                 pipedValue can be either the value to set, or an object {key: string, value: any} 
 * @param key 
 * @param value 
 * @param storeName 
 * @param databaseName 
 * @param databaseVersion 
 */
export const setIKeyVal3 = 
  (key?: string, value?: any, storeName?: string, databaseName?: string, databaseVersion?: number): BotAction10<void, BotIndexedDBInjects<any>> => 
    async(page, ...injects: BotIndexedDBInjects<any>) => {
      const [injectDatabaseName, injectDatabaseVersion, injectStoreName, pipedValue] = injects

      if (!value) {
        if (pipedValue) {
          if (pipedValue.value) {
            value = pipedValue.value
          } else {
            value = pipedValue
          }
        }
      }

      await page.evaluate(
        setIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName || 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion || 1,
        storeName ? storeName : injectStoreName || 'missing-store', 
        key ? key : pipedValue.key || 'missing-key',
        value ? value : 'missing-value'
      )
    }


export const setIndexDBStoreDataKeyValue = (databaseName: string, databaseVersion: number, storeName: string, key: string, value: any): BotAction => async(page) => {
  await page.evaluate(setIndexedDBStoreValue, databaseName, databaseVersion, storeName, key, value)
}

export const setIndexDBStoreDataKeyValue2 = 
  (key: string, value: any, storeName?: string, databaseName?: string, databaseVersion?: number): BotAction => 
    async(page, piped, options, ...injects) => {
      const [injectDataBaseVersion, injectDataBaseName, injectStoreName] = injects

      await page.evaluate(
        setIndexedDBStoreValue,
        databaseName ? databaseName : injectDataBaseName || '',
        databaseVersion ? databaseVersion : injectDataBaseVersion || 1,
        storeName ? storeName : injectStoreName || '', 
        key,
        value
      )
    }

/**
 * 
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 */
export const getIndexDBStoreDataKeyValue = <T>(databaseName: string, databaseVersion: number, storeName: string, key: string): BotAction<T> => async(page) =>
  await page.evaluate(getIndexedDBStoreValue, databaseName, databaseVersion, storeName, key) as T

export const getIndexDBStoreDataKeyValue2 = 
  <T>(key: string, storeName?: string, databaseName?: string, databaseVersion?: number): BotAction<T> => 
    async(page, piped, options, ...injects) => {
      const [injectDataBaseVersion, injectDataBaseName, injectStoreName] = injects
      
      return await page.evaluate(
        getIndexedDBStoreValue,
        databaseName ? databaseName : injectDataBaseName || '',
        databaseVersion ? databaseVersion : injectDataBaseVersion || 1,
        storeName ? storeName : injectStoreName || '', 
        key
      ) as T
    }


/**
 * 
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 * @param value 
 */
function setIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string, value: any) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) { 
      reject(this.error) 
    }
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
      this.result.createObjectStore(storeName)
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      db.onerror = () => { 
        db.close()
        reject(this.error)
      }

      db.transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .put(value, key)
        .onsuccess = () => { 
          db.close()
          resolve() 
        }
    }
  })
}

/**
 * 
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 */
function getIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) { 
      reject(this.error) 
    }
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
      this.result.createObjectStore(storeName)
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      db.onerror = (err) => { 
        db.close()
        reject(this.error) 
      }

      db.transaction(storeName, 'readonly')
        .objectStore(storeName)
        .get(key)
        .onsuccess = function(this: IDBRequest<any>, ev: Event) {
          const result = this.result // If key isn't found, the result returned is undefined !
          db.close()
          resolve(result)
        }
    }
  })
}
