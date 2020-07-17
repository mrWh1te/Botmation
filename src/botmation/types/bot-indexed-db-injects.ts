//

import { Pipe } from "./pipe"

// IndexedDB
export type IndexedDBDatabaseName = string
export type IndexedDBDatabaseVersion = number
export type IndexedDBStoreName = string
export type IndexedDBStoreNameKey = string
export type IndexedDBStoreNameKeyValue = any

/**
 * @description   [databaseName, databaseVersion, storeName, and Piped value]
 */
export type BotIndexedDBInjects<V = undefined> = [IndexedDBDatabaseName, IndexedDBDatabaseVersion, IndexedDBStoreName, Pipe<V>]