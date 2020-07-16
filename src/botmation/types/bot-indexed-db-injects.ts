//

import { PipeValue } from "./pipe"

// IndexedDB
export type IndexedDBDatabaseName = string
export type IndexedDBDatabaseVersion = number
export type IndexedDBStoreName = string
export type IndexedDBStoreNameKey = string
export type IndexedDBStoreNameKeyValue = any

/**
 * @description   [databaseName, databaseVersion, storeName, and Piped value]
 */
export type BotIndexedDBInjects<P> = [IndexedDBDatabaseName, IndexedDBDatabaseVersion, IndexedDBStoreName, PipeValue<P>]