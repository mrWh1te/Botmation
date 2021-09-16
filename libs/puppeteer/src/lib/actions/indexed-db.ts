import { Action, InjectValue } from '@botmation/v2core'
import { inject } from '@botmation/v2core'
import { PipeValue } from '@botmation/v2core'
import { isObjectWithKey, isObjectWithValue } from '@botmation/v2core'
import { pipe } from '@botmation/v2core'

import { InjectBrowserPage } from '../types/injects'

import { getIndexedDBStoreValue, setIndexedDBStoreValue, deleteIndexedDBDatabase } from '../helpers/indexed-db'

export type InjectsIndexedDB = InjectBrowserPage & Partial<InjectValue> & {
  idb: indexedDBConnection
}

export interface indexedDBConnection {
  databaseName?: string,
  storeName?: string,
  databaseVersion?: number
}

/**
 *
 * @param page
 */
export const deleteIndexedDB = (databaseName?: string): Action<InjectsIndexedDB> => async({page, idb: {databaseName: injectedDatabaseName}}) => {
  await page.evaluate(
    deleteIndexedDBDatabase,
    databaseName ?? injectedDatabaseName
  )
}

/**
 * @description    It's a higher-order Action that sets injects for identifying information of one IndexedDB store
 *                 Database name & version, and Store name are accepted then injected into all provided actions
 *                 Provided actions can overwride the injected params, on an individual basis
 *                 Parent assembly-line injects are not passed in
 * @param databaseName
 * @param databaseVersion
 * @param storeName
 */
export const indexedDBStore = (databaseName: string, storeName: string, databaseVersion?: number) =>
  (...actions: Action<InjectsIndexedDB>[]): Action<InjectsIndexedDB> =>
    pipe()(
      inject({
        idb: {
          databaseVersion, databaseName, storeName
        }})(...actions)
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
  (key?: string, value?: any, storeName?: string, databaseName?: string, databaseVersion?: number): Action<InjectsIndexedDB> =>
    async({value: pipeValue, page, idb:{databaseVersion: injectDatabaseVersion, databaseName: injectDatabaseName, storeName: injectStoreName}}) => {
      value ??= isObjectWithValue(pipeValue) ? pipeValue['value'] : pipeValue ??= 'missing-value'
      key ??= isObjectWithKey(pipeValue) ? pipeValue['key'] : 'missing-key'

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
  (key?: string, storeName?: string, databaseName?: string, databaseVersion?: number): Action<InjectsIndexedDB> =>
    async({value: pipeValue, page, idb:{databaseVersion: injectDatabaseVersion, databaseName: injectDatabaseName, storeName: injectStoreName}}) => {
      key ??= isObjectWithKey(pipeValue) ? pipeValue['key'] : typeof pipeValue === 'string' ? pipeValue : 'missing-key'

      return page.evaluate(
        getIndexedDBStoreValue,
        databaseName ? databaseName : injectDatabaseName ?? 'missing-db-name',
        databaseVersion ? databaseVersion : injectDatabaseVersion ?? undefined, // on open, it will grab latest version if undefined
        storeName ? storeName : injectStoreName ?? 'missing-store',
        key
      ) as PipeValue
    }



