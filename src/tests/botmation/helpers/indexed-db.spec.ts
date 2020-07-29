require('fake-indexeddb/auto') // mock IndexedDB (all in memory)

import { setIndexedDBStoreValue, getIndexedDBStoreValue } from 'botmation/helpers/indexed-db'
import { rejects } from 'assert'

/**
 * @description   IndexedDB Helpers
 * @note          This suite uses `fake-indexeddb` for an in-memory global of IndexedDB
 *                None of these tests are ran inside a Puppeteer Page
 *                The related BotAction's evaluate these functions within Puppeteer Page's
 *                When it comes to testing these helper functions, we use the IndexedDB mock
 */
describe('[Botmation] helpers/indexed-db', () => {
  const databaseVersion = 1
  
  const databaseName = 'botmationDB'
  const databaseStoreName = 'botmationStore'

  beforeEach(async() => {
    // Attempt to Delete the DB before each test so every test has an empty slate of IndexedDB 
    await new Promise((resolve, reject) => {
      const deleteDBRequest = indexedDB.deleteDatabase(databaseName)
      deleteDBRequest.onerror = () => reject()
      deleteDBRequest.onsuccess = () => resolve()
    })
  })

  //
  // Unit Tests
  it('getIndexedDBStoreValue() should return a Promise with the value by key in an IndexedDB Store', async() => {
    // Setup Test
    // 1. Create DB: 'botmationDB'
    // 2. Create store: 'botmationStore'
    // 3. Insert key/value: 'test-1-key'/'test-1-value'
    const setupTestRequest = indexedDB.open(databaseName)
    await new Promise((resolve, reject) => {
      setupTestRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) {
        return reject(this.error)
      }
      setupTestRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
        if (!this.result.objectStoreNames.contains(databaseStoreName)) {
          this.result.createObjectStore(databaseStoreName)
        }
      }
      setupTestRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
        const db = this.result

        db.onerror = (err) => { 
          db.close()
          return reject(this.error) 
        }

        db.transaction(databaseStoreName, 'readwrite')
          .objectStore(databaseStoreName)
          .put('test-1-value', 'test-1-key')
          .onsuccess = function(this: IDBRequest<any>, ev: Event) {
            db.close()
            return resolve()
          }
      }
    })

    await expect(getIndexedDBStoreValue(databaseName, 1, 'botmationStore', 'test-1-key')).resolves.toEqual('test-1-value')
  })

  it('getIndexedDBStoreValue() should reject on IndexedDB Request Error', async() => {
    // Create DB with high version number, then request lower number to trigger VersionError
    const setupTestRequest = indexedDB.open(databaseName, 99)
    await new Promise((resolve, reject) => {
      setupTestRequest.onerror = function(this: IDBRequest<IDBDatabase>, ev: Event) {
        return reject(this.error)
      }
      setupTestRequest.onupgradeneeded = function(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any { 
        if (!this.result.objectStoreNames.contains(databaseStoreName)) {
          this.result.createObjectStore(databaseStoreName)
        }
      }
      setupTestRequest.onsuccess = function(this: IDBRequest<IDBDatabase>, ev: Event) {
        const db = this.result

        db.onerror = (err) => { 
          db.close()
          return reject(this.error) 
        }

        db.transaction(databaseStoreName, 'readwrite')
          .objectStore(databaseStoreName)
          .put('test-2-value', 'test-2-key')
          .onsuccess = function(this: IDBRequest<any>, ev: Event) {
            db.close()
            return resolve()
          }
      }
    })

    try {
      await getIndexedDBStoreValue(databaseName, 5, databaseStoreName, 'test-2-key')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toEqual('VersionError')
    }
  })

  it('getIndexedDBStoreValue() should reject on a transaction Error', async() => {
    await new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName)

      request.onerror = function(this, ev) {
        return reject(this.error)
      }
      request.onupgradeneeded = function(this, ev) {
        this.result.createObjectStore(databaseStoreName)
      }
      request.onsuccess = function(this, ev) {
        const db = this.result

        db.onerror = function(this, ev) {
          db.close()
          return reject('IndexedDB Request DB.onerror()')
        }

        db.transaction(databaseStoreName, 'readwrite')
          .objectStore(databaseStoreName)
          .put('test-3-value', 'test-3-key')
          .onsuccess = function(this, ev) {
            db.close()
            return resolve()
          }
      }
    })

    try {
      await getIndexedDBStoreValue(databaseName, 1, 'store-does-not-exist', 'test-3-key')
    } catch (error) {
      expect(error).toBeInstanceOf(Error) // store does not exist
    }
  })

  it('getIndexedDBStoreValue() should return undefined when key is not found', async() => {
    // test setup
    await new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName)

      request.onerror = function(this, ev) {
        return reject(this.error)
      }
      request.onupgradeneeded = function(this, ev) {
        this.result.createObjectStore(databaseStoreName)
      }
      request.onsuccess = function(this, ev) {
        const db = this.result

        db.onerror = function(this, ev) {
          db.close()
          return reject('IndexedDB Request DB.onerror()')
        }

        db.transaction(databaseStoreName, 'readwrite')
          .objectStore(databaseStoreName)
          .put('test-3-value', 'test-3-key')
          .onsuccess = function(this, ev) {
            db.close()
            return resolve()
          }
      }
    })
    
    expect(getIndexedDBStoreValue(databaseName, 1, databaseStoreName, 'does-not-exist-key')).resolves.toBeUndefined()
  })

  // it('setIndexedDBStoreValue() should reject on IndexedDB Database Error ie from data constraint', async() => {
  //   // thank you, https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
  //   // const customerData = [
  //   //   { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  //   //   { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
  //   // ]

  //   await new Promise((resolve, reject) => {
  //     const request = indexedDB.open(databaseName)
  
  //     request.onerror = function(this, ev) {
  //       ev.stopPropagation()
  //       // Handle errors.
  //       return reject()
  //     }
  //     request.onupgradeneeded = function(this, event) {
  //       const db = this.result
  
  //       // Create an objectStore to hold information about our customers. We're
  //       // going to use "ssn" as our key path because it's guaranteed to be
  //       // unique - or at least that's what I was told during the kickoff meeting.
  //       const objectStore = db.createObjectStore("customers", { keyPath: "ssn" })
  
  //       // Create an index to search customers by name. We may have duplicates
  //       // so we can't use a unique index.
  //       objectStore.createIndex("email", "email", { unique: true })
  
  //       // Create an index to search customers by email. We want to ensure that
  //       // no two customers have the same email, so use a unique index.
  //       // objectStore.createIndex("email", "email", { unique: true })
  
  //       // Use transaction oncomplete to make sure the objectStore creation is 
  //       // finished before adding data into it.
  //       objectStore.transaction.oncomplete = function(event) {
  //         // Store values in the newly created objectStore.
  //         // const customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers")
  //         // customerData.forEach(function(customer) {
  //         //   customerObjectStore.add(customer)
  //         // })
  //         db.close()
  //         return resolve()
  //       }
  //       objectStore.transaction.onerror = function(this, ev) {
  //         ev.stopPropagation()
  //         return reject()
  //       }
  //     }
  //   })

  //   try {
  //     await setIndexedDBStoreValue(databaseName, 1, 'customers', 'test-4-key', 'test-4-value')
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(Error)
  //     expect(error.name).toEqual('DataError')
  //   }
  // })

  //
  // E2E of setting and getting IndexedDB Store key/value pairs, to save time
  // May expand with unit tests, but this should catch most if not all relevant bugs from changing either of these two functions
  it('should set a key/value pair in the specified database, database version and store name then read that key/value back', async() => {
    const key = 'test-key-1'
    const value = 'test-value-1'

    await setIndexedDBStoreValue(databaseName, 5, databaseStoreName, key, value)
    await expect(getIndexedDBStoreValue(databaseName, 5, databaseStoreName, key)).resolves.toEqual('test-value-1')
  })

})
