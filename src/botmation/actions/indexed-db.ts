import { openDB } from 'idb'

import { BotAction } from '../interfaces/bot-action.interfaces'
import { logMessage } from 'botmation/helpers/console'

// ideas

// indexedDB(...BotActions) // PIPE!
// indexedDB(dbName, dbVersion, dbStore?)(
//   // all read/writes/deletes have supplied dbName, dbVersion, dbStore
//   // works like a pipe, so can mix BotAction's here, but with also those supplied injects (optional 3rd)
// )

// consider dev use-cases:
//  1. Getting data to check if we are authenticated

export interface IndexedDBInfo {
  name: string
  version: number
}

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
export const setIndexDBStoreDataKeyValue = (databaseName: string, databaseVersion: number, storeName: string, key: string, value: any): BotAction => async(page) => {
  await page.evaluate(setIndexedDBStoreValue, databaseName, databaseVersion, storeName, key, value)
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