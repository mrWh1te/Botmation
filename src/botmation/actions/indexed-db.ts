
import { BotAction, BotIndexedDBAction } from '../interfaces/bot-actions.interfaces'
import { unpipeInjects } from '../helpers/pipe'
import { getIndexedDBStoreValue, setIndexedDBStoreValue } from '../helpers/indexed-db'
import { injects } from './injects'
import { PipeValue } from '../types/pipe'
import { pipe } from './assembly-line'

/**
 * @description    It's a utility higher-order BotAction that sets injects before the parent chain/pipe's injects, IndexedDB store data
 *                 Database name & version, and Store name are accepted then injected into all provided actions
 * @param databaseName 
 * @param databaseVersion 
 * @param storeName 
 */
export const indexedDBStore = (databaseName: string, databaseVersion: number, storeName: string) =>
  (...actions: BotAction<PipeValue|void>[]): BotAction<any> =>
    pipe()(
      injects(
        databaseName, databaseVersion, storeName
      )(...actions)
    )
      

/**
 * @description    Supports setting the 'key' and/or 'value' from `pipedValue` 
 *                 pipedValue can be either the value to set, or an object {key: string, value: any} 
 * @param key 
 * @param value 
 * @param storeName 
 * @param databaseName 
 * @param databaseVersion 
 */
export const setIndexedDBValue = 
  (key?: string, value?: any, storeName?: string, databaseName?: string, databaseVersion?: number): BotIndexedDBAction<void> => 
    async(page, ...injects) => {
      // it works, the types of the Injects are known, but resolved to the end types so devs dont get to know more....
      const [injectDatabaseName, injectDatabaseVersion, injectStoreName, pipedValue] = unpipeInjects(injects)

      if (!value) {
        if (pipedValue) {
          // idea here is that the piped value is anothe object with keys {key: '', value: ''} -> to map as what we are setting in the DB
          if (pipedValue.value) {
            value = pipedValue.value
          } else {
            value = pipedValue
          }
        }
      }
      if (!key) {
        if (pipedValue && pipedValue.key) {
          key = pipedValue.key
        }
      }

      await page.evaluate(
        setIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ? injectDatabaseName : 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ? injectDatabaseVersion : 1,
        storeName ? storeName : injectStoreName ? injectStoreName : 'missing-store', 
        key ? key : 'missing-key',
        value ? value : 'missing-value'
      )
    }
    
/**
 * 
 * @param key 
 * @param storeName 
 * @param databaseName 
 * @param databaseVersion 
 */
export const getIndexedDBValue = 
  (key?: string, storeName?: string, databaseName?: string, databaseVersion?: number): BotIndexedDBAction<PipeValue> => 
    async(page, ...injects) => {
      // it works, the types of the Injects are known, but resolved to the end types so devs dont get to know more....
      const [injectDatabaseName, injectDatabaseVersion, injectStoreName, pipedValue] = unpipeInjects(injects)

      if (!key) {
        if (pipedValue) {
          if (pipedValue.key) {
            key = pipedValue.key
          } else {
            key = pipedValue
          }
        }
      }

      return await page.evaluate(
        getIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ? injectDatabaseName : 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ? injectDatabaseVersion : 1,
        storeName ? storeName : injectStoreName ? injectStoreName : 'missing-store',
        key ? key : 'missing-key'
      ) as PipeValue
    }



