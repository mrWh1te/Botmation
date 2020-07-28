// IndexedDB
export type IndexedDBDatabaseName = string
export type IndexedDBDatabaseVersion = number
export type IndexedDBStoreName = string

/**
 * @description   indexedDBStore()() injects the following databaseName, databaseVersion, storeName at the start of the injects array and Pipe at the end (in case of past injects from higher order)
 */
export type BotIndexedDBInjects = [IndexedDBDatabaseName?, IndexedDBDatabaseVersion?, IndexedDBStoreName?, ...any[]]