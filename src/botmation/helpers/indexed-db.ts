// TODO thoroughly test playing with db's, confirm onupgradeneeded and onsuccess when/order

/**
 * 
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
        let store = db.createObjectStore(storeName)
        store.put(value, key)
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
 * 
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 * @param key 
 */
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
          const result = this.result // If key isn't found, the result returned is undefined
          db.close()
          return resolve(result)
        }
    }
  })
}
