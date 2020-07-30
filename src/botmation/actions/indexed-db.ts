
import { BotAction, BotIndexedDBAction } from '../interfaces/bot-actions'
import { unpipeInjects, pipeInjects } from '../helpers/pipe'
import { getIndexedDBStoreValue, setIndexedDBStoreValue } from '../helpers/indexed-db'
import { inject } from './inject'
import { PipeValue } from '../types/pipe-value'
import { isObjectWithKey, isObjectWithValue } from '../types/objects'
import { getQueryKey, getQueryKeyValue } from '../types/database'

/**
 * @description    It's a higher-order BotAction that sets injects for identifying information of one IndexedDB store
 *                 Database name & version, and Store name are accepted then injected into all provided actions
 *                 Provided actions can overwride the injected params, on an individual basis
 *                 Parent assembly-line injects are not passed in
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 */
export const indexedDBStore = (databaseName: string, storeName: string, databaseVersion?: number) =>
  (...actions: BotAction<PipeValue|void>[]): BotAction<any> =>
    async(page, ...injects) => 
      await inject(
        databaseVersion, databaseName, storeName
      )(...actions)(page, ...pipeInjects(injects))
      
      

/**
 * @description    Set an IndexedDB Store's key value
 *                 Supports setting the 'key' and/or 'value' from the Pipe's value
 *                 Pipe value can be either the value to set, or an object {key: string, value: any} 
 * @param key 
 * @param value 
 * @param storeName 
 * @param databaseName 
 * @param databaseVersion 
 */
export const setIndexedDBValue = 
  (key?: string, value?: any, storeName?: string, databaseName?: string, databaseVersion?: number): BotIndexedDBAction<void> => 
    async(page, ...injects) => {
      const [pipedValue, injectDatabaseVersion, injectDatabaseName, injectStoreName] = unpipeInjects<getQueryKeyValue>(injects, 3)

      if (!value) {
        if (pipedValue) {
          // idea here is that the piped value is another object with keys {key: '', value: ''} -> to map as what we are setting in the DB
          if (isObjectWithValue(pipedValue)) {
            value = pipedValue.value
          } else {
            value = pipedValue
          }
        }
      }
      if (!key) {
        if (isObjectWithKey(pipedValue)) {
          key = pipedValue.key
        }
      }

      await page.evaluate(
        setIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ? injectDatabaseName : 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ? injectDatabaseVersion : undefined, // grab latest version
        storeName ? storeName : injectStoreName ? injectStoreName : 'missing-store', 
        key ? key : 'missing-key',
        value ? value : 'missing-value'
      )
    }
    
/**
 * @description    Get an IndexedDB Store's key value
 *                 Supports 'key' from the Pipe's value
 *                 Pipe value can be either the key whose value to get, or an object that specifies the key such as {key: string} 
 * @param key 
 * @param storeName 
 * @param databaseName 
 * @param databaseVersion 
 */
export const getIndexedDBValue = 
  (key?: string, storeName?: string, databaseName?: string, databaseVersion?: number): BotIndexedDBAction<PipeValue> => 
    async(page, ...injects) => {
      const [pipeValue, injectDatabaseVersion, injectDatabaseName, injectStoreName] = unpipeInjects<getQueryKey>(injects, 3)

      if (!key) {
        if (pipeValue) {
          if (isObjectWithKey(pipeValue)) {
            key = pipeValue.key
          } else {
            key = pipeValue
          }
        }
      }

      return await page.evaluate(
        getIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ? injectDatabaseName : 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ? injectDatabaseVersion : undefined, // on open, it will grab latest version if undefined
        storeName ? storeName : injectStoreName ? injectStoreName : 'missing-store',
        key ? key : 'missing-key'
      ) as PipeValue
    }



