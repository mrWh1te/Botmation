import { openDB } from 'idb'

import { BotAction, createBotActionFactory, BotAction10, BotAction5, BotIndexedDBInjects } from '../interfaces/bot-actions.interfaces'
import { logMessage, logError } from 'botmation/helpers/console'
import { BotActionsPipeFactory5 } from 'botmation/factories/bot-actions-pipe.factory'

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
 * @description    It's a utility BotAction that injects before the primary injects, IndexedDB important data
 *                 Database name & version, and Store name, so the set of BotAction's ran inside, have all 3 injected first
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 */
export const indexedDBStore = (databaseName: string, databaseVersion: number, storeName: string) =>
  (...actions: BotAction5[]): BotAction5 =>
    async(page, ...injects: any[]) => // no way for indexedDBStore()() to take a piped value to pass in.... unless all piped values are branded wrapped objects.... testable, then it's at the start of all injects, possibly.... but must be tested, how does that effect typing the injects of the array after it???, maybe instead put it at the end, leave injects mostly any[] except for advanced botactions then test the last inject with inject.brand === 'pipedValue' && typeof inject.value !== undefined (otherwise empty pipe)
      await BotActionsPipeFactory5<any>(page, databaseName, databaseVersion, storeName, ...injects)(...actions)
      

    // problem is no way to tell when there is a piped value in injects, in higher order bot action calls like above.....

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
  (key?: string, value?: any, storeName?: string, databaseName?: string, databaseVersion?: number): BotAction5 => 
    async(page, ...injects: BotIndexedDBInjects<any>) => {
      // it works, the types of the Injects are known, but resolved to the end types so devs dont get to know more....
      const [injectDatabaseName, injectDatabaseVersion, injectStoreName, pipedValue] = injects

      console.log({key,value,storeName,databaseName,databaseVersion})
      console.log({injectDatabaseName, injectDatabaseVersion, injectStoreName, pipedValue})

      if (!value) {
        if (pipedValue) {
          if (pipedValue.value) {
            value = pipedValue.value
          } else {
            value = pipedValue
          }
        }
      }
      if (!key) {
        if (pipedValue) {
          if (pipedValue.key) {
            key = pipedValue.key
          }
        }
      }

      console.log('key = ' + key)
      console.log('value = ' + value)

      console.log(
        [
          databaseName ? databaseName : injectDatabaseName ? injectDatabaseName : 'missing-db-name',
          databaseVersion ? databaseVersion : injectDatabaseVersion ? injectDatabaseVersion : 1,
          storeName ? storeName : injectStoreName ? injectStoreName : 'missing-store', 
          key ? key : 'missing-key',
          value ? value : 'missing-value'
        ]
      )

      await page.evaluate(
        setIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ? injectDatabaseName : 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ? injectDatabaseVersion : 1,
        storeName ? storeName : injectStoreName ? injectStoreName : 'missing-store', 
        key ? key : 'missing-key',
        value ? value : 'missing-value'
      )
    }

export const getIKeyVal3 = 
  <R>(key?: string, storeName?: string, databaseName?: string, databaseVersion?: number): BotAction5<R> => 
    async(page, ...injects: BotIndexedDBInjects<any>): Promise<R> => {
      // it works, the types of the Injects are known, but resolved to the end types so devs dont get to know more....
      const [injectDatabaseName, injectDatabaseVersion, injectStoreName, pipedValue] = injects

      if (!key) {
        if (pipedValue) {
          if (pipedValue.key) {
            key = pipedValue.key
          } else {
            key = pipedValue
          }
        }
      }

      const evaluatedValue = await page.evaluate(
        getIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ? injectDatabaseName : 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ? injectDatabaseVersion : 1,
        storeName ? storeName : injectStoreName ? injectStoreName : 'missing-store',
        key ? key : 'missing-key'
      ) as R

      console.log('evaluated value = ', evaluatedValue)

      return evaluatedValue
    }

// setIKeyVal3('key', 'value')(page, 'dbName', 1, 'storeName', undefined)


export const setIndexDBStoreDataKeyValue = (databaseName: string, databaseVersion: number, storeName: string, key: string, value: any): BotAction => async(page) => {
  await page.evaluate(setIndexedDBStoreValue, databaseName, databaseVersion, storeName, key, value)
}

// export const setIndexDBStoreDataKeyValue2 = 
//   (key: string, value: any, storeName?: string, databaseName?: string, databaseVersion?: number): BotAction => 
//     async(page, piped, options, ...injects) => {
//       const [injectDataBaseVersion, injectDataBaseName, injectStoreName] = injects

//       await page.evaluate(
//         setIndexedDBStoreValue,
//         databaseName ? databaseName : injectDataBaseName || '',
//         databaseVersion ? databaseVersion : injectDataBaseVersion || 1,
//         storeName ? storeName : injectStoreName || '', 
//         key,
//         value
//       )
//     }

/**
 * 
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 */
export const getIndexDBStoreDataKeyValue = <T>(databaseName: string, databaseVersion: number, storeName: string, key: string): BotAction<T> => async(page) =>
  await page.evaluate(getIndexedDBStoreValue, databaseName, databaseVersion, storeName, key) as T

// export const getIndexDBStoreDataKeyValue2 = 
//   <T>(key: string, storeName?: string, databaseName?: string, databaseVersion?: number): BotAction<T> => 
//     async(page, piped, options, ...injects) => {
//       const [injectDataBaseVersion, injectDataBaseName, injectStoreName] = injects
      
//       return await page.evaluate(
//         getIndexedDBStoreValue,
//         databaseName ? databaseName : injectDataBaseName || '',
//         databaseVersion ? databaseVersion : injectDataBaseVersion || 1,
//         storeName ? storeName : injectStoreName || '', 
//         key
//       ) as T
//     }


/**
 * 
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 * @param value 
 */
function setIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string, value: any) {
  console.log('setIndexedDBStoreValue()')
  return new Promise((resolve, reject) => {

    console.log({databaseName, databaseVersion, storeName, key, value})

    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) { 
      console.log('open request error = ', this.error)
      reject(this.error) 
    }
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
      if (!this.result.objectStoreNames.contains(storeName)) {
        console.log('creating store: ' + storeName)
        let store = this.result.createObjectStore(storeName)
        store.put
      }
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      if (!db.objectStoreNames.contains(storeName)) {
        console.log('creating store: ' + storeName)
        let store = db.createObjectStore(storeName)
        store.put(value, key)
      } else {
        db.onerror = () => { 
          console.log('set idb val error = ', this.error)
          db.close()
          return reject(this.error)
        }
  
        db.transaction(storeName, 'readwrite')
          .objectStore(storeName)
          .put(value, key)
          .onsuccess = () => { 
            console.log('set idb val success, closing')
            db.close()
            return resolve() 
          }
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
      console.log('[get] error = ', this.error)
      reject(this.error) 
    }
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
      this.result.createObjectStore(storeName)
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      db.onerror = (err) => { 
        console.log('[get] onsuccess error = ', this.error)
        db.close()
        return reject(this.error) 
      }

      db.transaction(storeName, 'readonly')
        .objectStore(storeName)
        .get(key)
        .onsuccess = function(this: IDBRequest<any>, ev: Event) {
          console.log('[get] success result = ' + this.result)
          const result = this.result // If key isn't found, the result returned is undefined
          db.close()
          return resolve(result)
        }
    }
  })
}
