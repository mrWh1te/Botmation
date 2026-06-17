//
// The following functions are evaluated in a Puppeteer Page instance's browser context
//

import { logError, logMessage } from "./console";

/**
 *
 * @param databaseName
 */
/* istanbul ignore next */
export function deleteIndexedDBDatabase(databaseName: string) {
  return new Promise<void>((resolve, reject) => {
    const DBDeleteRequest = indexedDB.deleteDatabase(databaseName);

    DBDeleteRequest.onerror = function(event) {
      logError('delete IndexedDB Database name = ' + databaseName)
      event.stopPropagation()
      return reject(this.error)
    };

    DBDeleteRequest.onsuccess = function() {
      return resolve()
    };

    DBDeleteRequest.onblocked = function(event) {
      event.stopPropagation()
      logMessage('blocked attempt to delete IndexedDB Database name = ' + databaseName)
      return resolve()
    };
  })
}

/**
 * @description      Async function to set an IndexedDB Store value by key
 * @param databaseName
 * @param databaseVersion
 * @param storeName
 * @param key
 * @param value
 */
/* istanbul ignore next */
export function setIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string, value: any) {
  return new Promise<void>((resolve, reject) => {

    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      ev.stopPropagation()
      return reject(this.error)
    }

    // when adding a new store, do a higher db version number to invoke this function:
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any {
      /* istanbul ignore next */
      if (!this.result.objectStoreNames.contains(storeName)) {
        this.result.createObjectStore(storeName)
      }
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      try {
        db.transaction(storeName, 'readwrite')
          .objectStore(storeName)
          .put(value, key)
          .onsuccess = function(this) {
            db.close()
            return resolve()
          }
      } catch (error) {
        db.close()
        return reject(error)
      }
    }
  })
}

/**
 * @description      Async function to get an IndexedDB Store value by key
 * @param databaseName
 * @param databaseVersion
 * @param storeName
 * @param key
 */
/* istanbul ignore next */
export function getIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      return reject(this.error)
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      try {
        const tx = db.transaction(storeName, 'readonly')
          .objectStore(storeName)
          .get(key)

          tx.onsuccess = function(this: IDBRequest<any>) {
            const result = this.result // If key isn't found, the result resolved is undefined
            db.close()
            return resolve(result)
          }

      } catch (error) {
        db.close()
        return reject(error)
      }
    }
  })
}
