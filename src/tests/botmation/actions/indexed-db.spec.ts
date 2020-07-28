import { Page } from 'puppeteer'

import { BASE_URL } from 'tests/urls'
import { 
  setIndexedDBValue,
  getIndexedDBValue,
  indexedDBStore
} from 'botmation/actions/indexed-db'
import { BotIndexedDBInjects } from 'botmation/types/bot-indexed-db-inject'

/**
 * @description   IndexedDB BotAction's
 */
describe('[Botmation] actions/indexed-db', () => {
  let mockPage: Page

  // Function sources for the key & value support both higher-order param and Pipe.value
  const higherOrderParamKey = 'higher-order-key'
  const higherOrderParamValue = 'higher-order-value'
  const higherOrderStoreName = 'higher-order-store-name'
  const higherOrderDatabaseName = 'higher-order-database-name'
  const higherOrderDatabaseVersion = 1
  
  const injectStoreName = 'inject-store-name'
  const injectDatabaseName = 'inject-database-name'
  const injectDatabaseVersion = 2
  
  const injectedPipeParamKey = 'pipe-key'
  const injectedPipeParamValue = 'pipe-value'

  beforeEach(() => {
    mockPage = {
      evaluate: jest.fn()
    } as any as Page
  })

  //
  // Basic Integration Tests
  //  - testing param support via higher order function call or injects
  //    - higher order values override corresponding injected values
  // it('setIndexedDBValue() should call Page.evaluate() with a helper function and the correct values for key, value, storeName, databaseName, and databaseVersion', async() => {
  //   // No injects, key/value comes from higher order func call
  //   await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue)(mockPage)

  //   // higher order key, value through Pipe
  //   await setIndexedDBValue(undefined, higherOrderParamValue)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

  //   // injects value, key through Pipe (1 object for case of supporting Piping both key/value, and the other just value, no object for the case of shorter path in Piping key (not possible for value, in this particular BotAction)
  //   await setIndexedDBValue(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: {value: injectedPipeParamValue}})
  //   await setIndexedDBValue(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: injectedPipeParamValue})

  //   // key/value through Pipe, no higher order param
  //   await setIndexedDBValue()(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}})

  //   // nothing at all, safe fallbacks for key/value
  //   await setIndexedDBValue()(mockPage)

  //   // Injects have Pipe with value, but higher order func call param overloads that value, without a higher-order key
  //   await setIndexedDBValue(undefined, higherOrderParamValue)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}}) // key comes from injects, value ultimately comes from higher order

  //   // Injects have Pipe with both key/value, but higher order func call param overloads the key
  //   await setIndexedDBValue(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}}) // key ultimately comes from higher order, value comes from Pipe

  //   // Expectations - higher-order params overwrites Pipe provided ones, always
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'higher-order-key', 'higher-order-value')
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'pipe-key', 'higher-order-value')
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), 'higher-order-key', 'pipe-value')
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(4, expect.any(Function), 'higher-order-key', 'pipe-value')
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(5, expect.any(Function), 'pipe-key', 'pipe-value')
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(6, expect.any(Function), 'missing-key', 'missing-value')
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(7, expect.any(Function), 'pipe-key', 'higher-order-value')
  //   expect(mockPage.evaluate).toHaveBeenNthCalledWith(8, expect.any(Function), 'higher-order-key', 'pipe-value')
  // })

  it('getIndexedDBValue() should call Page.evaluate() with a helper function and the correct value for `key`', async() => {
    // no injects, all values come from higher order
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage)

    // varying BotIndexedDBInjects, all values come from higher order
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName)

    // Full BotIndexedDBInjects with Pipe for `key`, higher order key overrides pipe provided
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: injectedPipeParamKey})
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // No higher order, so key comes from Pipe, other values from injects
    await getIndexedDBValue()(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: injectedPipeParamKey})
    await getIndexedDBValue()(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // 9
    // Mixes of higher order and injects
    await getIndexedDBValue(higherOrderParamKey)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName)(mockPage, injectDatabaseName, injectDatabaseVersion)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion)(mockPage, injectDatabaseName)

    // missing everything, safe fallbacks
    await getIndexedDBValue()(mockPage)

    // expectations
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(4, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(5, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(6, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key')

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(7, expect.any(Function), 'inject-database-name', 2, 'inject-store-name', 'pipe-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(8, expect.any(Function), 'inject-database-name', 2, 'inject-store-name', 'pipe-key')

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(9, expect.any(Function), 'inject-database-name', 2, 'inject-store-name', 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(10, expect.any(Function), 'inject-database-name', 2, 'higher-order-store-name', 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(11, expect.any(Function), 'inject-database-name', 1, 'higher-order-store-name', 'higher-order-key')

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(12, expect.any(Function), 'missing-db-name', 1, 'missing-store', 'missing-key')
  })

  //
  // Unit-Tests / E2E 
  //   to confirm we are calling the correct Functions. The integration tests above dont have a way to check which anonymous functions ran.., this e2e helps confirm they are called
  // it('should set a few key/value pairs, get the values by key, remove a key/value pair, fail safely in trying to get that key/value and clear all key/value pairs', async() => {
  //   // Puppeteer page, load some URL
  //   await page.goto(BASE_URL)

  //   // 1. Create some key/value pairs in Local Storage
  //   await setIndexedDBValue('key-1', 'value-1')(page)
  //   await setIndexedDBValue('key-2', 'value-2')(page)
  //   await setIndexedDBValue('key-3', 'value-3')(page)

  //   // 2. Read in those newly created key/value pairs from Local Storage and test them
  //   await expect(getIndexedDBValue('key-1')(page)).resolves.toEqual('value-1')
  //   await expect(getIndexedDBValue('key-2')(page)).resolves.toEqual('value-2')
  //   await expect(getIndexedDBValue('key-3')(page)).resolves.toEqual('value-3')

  //   // 4. Safely returns null if key not found?
  //   await expect(getIndexedDBValue('key-1')(page)).resolves.toEqual(null)
  // })
})
