require('fake-indexeddb/auto')

import { setIndexedDBStoreValue, getIndexedDBStoreValue } from 'botmation/helpers/indexed-db'

/**
 * @description   Console Helpers
 */
describe('[Botmation] helpers/indexed-db', () => {
  const databaseName = 'botmationDB'
  const databaseVersion = 1
  
  const databaseStoreName = 'botmationStore'

  beforeEach(() => {
    // todo reset fake IndexedDB, if add more tests
  })

  //
  // E2E of setting and getting IndexedDB Store key/value pairs, to save time
  // May expand with unit tests, but this should catch most if not all relevant bugs from changing either of these two functions
  it('should set a key/value pair in the specified database, database version and store name then read that key/value back', async() => {
    const key = 'test-key-1'
    const value = 'test-value-1'

    await setIndexedDBStoreValue(databaseName, databaseVersion, databaseStoreName, key, value)
    await expect(getIndexedDBStoreValue(databaseName, databaseVersion, databaseStoreName, key)).resolves.toEqual('test-value-1')
  })

})
