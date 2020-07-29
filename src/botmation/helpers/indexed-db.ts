//
// The following functions are evaluated in a Puppeteer Page instance's browser context
//

/**
 * @description      Async function to set an IndexedDB Store value by key
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 * @param value 
 */
export function setIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string, value: any) {
  return new Promise((resolve, reject) => {

    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      ev.stopPropagation()
      return reject(this.error) 
    }

    // when adding a new store, do a higher db version number to invoke this function:
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
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
          .onsuccess = function(this, ev) {
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
export function getIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      openRequest.transaction?.db.close()
      return reject(this.error) 
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      try {
        const tx = db.transaction(storeName, 'readonly')
          .objectStore(storeName)
          .get(key)
  
          tx.onsuccess = function(this: IDBRequest<any>, ev: Event) {
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
