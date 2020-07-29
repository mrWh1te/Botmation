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
export function setIndexedDBStoreValue(databaseName: string, databaseVersion: number, storeName: string, key: string, value: any) {
  return new Promise((resolve, reject) => {

    const openRequest = indexedDB.open(databaseName, databaseVersion)

    openRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      ev.stopPropagation()
      return reject(this.error) 
    }
    openRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
      if (!this.result.objectStoreNames.contains(storeName)) {
        this.result.createObjectStore(storeName)
      }
    }

    openRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
      const db = this.result

      db.onerror = function(this: IDBDatabase, ev: Event) { 
        db.close()
        ev.stopPropagation()
        return reject()
      }

      // if (!db.objectStoreNames.contains(storeName)) {
      //   // this was added for a special case of adding a store
      //   // to a pre-existing db, but the code was faulty
      //   // this if block may not be necessary after-all
      //   // @todo determine if this is needed:
      //   const store = db.createObjectStore(storeName)

      //   store.put(value, key)

      //   store.transaction.oncomplete = function(this, ev) {
      //     db.close()
      //     return resolve()
      //   }
      //   store.transaction.onerror = function(this, ev) {
      //     ev.stopPropagation()
      //     return reject()
      //   }
      // } else {
        try {
          const tx = db.transaction(storeName, 'readwrite')
                      .objectStore(storeName)
                      .put(value, key)
          
          // tx.onerror = function(this, ev) {
          //   db.close()
          //   return reject(this.error)
          // }
          tx.onsuccess = function(this, ev) {
            db.close()
            return resolve()
          }
        } catch (error) {
          db.close()
          return reject(error)
        } 
      }
    // }
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
            const result = this.result // If key isn't found, the result resolved will be undefined
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
