//
// The following functions are evaluated in a Puppeteer Page instance's browser context
//

// TODO thoroughly test playing with idb's, confirm onupgradeneeded and onsuccess when/order, functionality

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
  return new Promise((resolve, reject) => {

    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) { 
      reject(this.error) 
    }
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
      if (!this.result.objectStoreNames.contains(storeName)) {
        let store = this.result.createObjectStore(storeName)
      }
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      if (!db.objectStoreNames.contains(storeName)) {
        // this was added for a special case of adding a store
        // to a pre-existing db, but the code was faulty
        // this if block may not be necessary after-all
        // @todo determine if this is needed:
        let store = db.createObjectStore(storeName)
        const storeRequest = store.put(value, key)

        storeRequest.onerror = () => {
          return reject()
        }
        storeRequest.onsuccess = () => {
          return resolve()
        }
      } else {
        db.onerror = () => { 
          db.close()
          return reject(this.error)
        }
  
        db.transaction(storeName, 'readwrite')
          .objectStore(storeName)
          .put(value, key)
          .onsuccess = () => { 
            db.close()
            return resolve() 
          }
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
      reject(this.error) 
    }
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
      this.result.createObjectStore(storeName)
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      db.onerror = (err) => { 
        db.close()
        return reject(this.error) 
      }

      db.transaction(storeName, 'readonly')
        .objectStore(storeName)
        .get(key)
        .onsuccess = function(this: IDBRequest<any>, ev: Event) {
          const result = this.result // If key isn't found, the result resolved will be undefined
          db.close()
          return resolve(result)
        }
    }
  })
}
