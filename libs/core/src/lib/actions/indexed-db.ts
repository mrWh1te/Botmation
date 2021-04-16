
import { BotAction, BotIndexedDBAction } from '../interfaces/bot-actions'
import { unpipeInjects } from '../helpers/pipe'
import { getIndexedDBStoreValue, setIndexedDBStoreValue, deleteIndexedDBDatabase } from '../helpers/indexed-db'
import { inject } from './inject'
import { PipeValue } from '../types/pipe-value'
import { isObjectWithKey, isObjectWithValue } from '../types/objects'
import { getQueryKey, getQueryKeyValue } from '../types/database'
import { pipe } from './assembly-lines'

/**
 *
 * @param page
 */
export const deleteIndexedDB = (databaseName?: string): BotIndexedDBAction<void> => async(page, ...injects) => {
  const [, , injectDatabaseName] = unpipeInjects(injects, 2)

  await page.evaluate(
    deleteIndexedDBDatabase,
    databaseName ?? injectDatabaseName
  )
}

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
    pipe()(
      inject(databaseVersion, databaseName, storeName)(
        ...actions
      )
    )

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
      let [pipeValue, injectDatabaseVersion, injectDatabaseName, injectStoreName] = unpipeInjects<getQueryKeyValue>(injects, 3)

      value ??= isObjectWithValue(pipeValue) ? pipeValue.value : pipeValue ??= 'missing-value'
      key ??= isObjectWithKey(pipeValue) ? pipeValue.key : 'missing-key'

      await page.evaluate(
        setIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ?? 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ?? undefined, // grab latest version
        storeName ? storeName : injectStoreName ?? 'missing-store',
        key,
        value
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
      let [pipeValue, injectDatabaseVersion, injectDatabaseName, injectStoreName] = unpipeInjects<getQueryKey|string>(injects, 3)

      key ??= isObjectWithKey(pipeValue) ? pipeValue.key : (pipeValue as string) ??= 'missing-key'

      return page.evaluate(
        getIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ?? 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ?? undefined, // on open, it will grab latest version if undefined
        storeName ? storeName : injectStoreName ?? 'missing-store',
        key ?? 'missing-key'
      ) as PipeValue
    }



