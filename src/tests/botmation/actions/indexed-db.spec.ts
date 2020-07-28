import { Page } from 'puppeteer'

import { 
  setIndexedDBValue,
  getIndexedDBValue,
  indexedDBStore
} from 'botmation/actions/indexed-db'

const mockInject3rdCall = jest.fn()
jest.mock('botmation/actions/inject', () => {
  return {
    inject: jest.fn(() => () => mockInject3rdCall)
  }
})

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

  it('indexedDBStore()() should set the first few injects as BotIndexedDBInjects from higher order params', async() => {
    const injectsWithoutPipe = [25, 'hi', 'World']
    let mockPage = {} as any as Page

    await indexedDBStore(higherOrderDatabaseName, higherOrderDatabaseVersion, higherOrderStoreName)()(mockPage)
    await indexedDBStore(higherOrderDatabaseName, higherOrderDatabaseVersion, higherOrderStoreName)()(mockPage, ...injectsWithoutPipe)
    await indexedDBStore(higherOrderDatabaseName, higherOrderDatabaseVersion, higherOrderStoreName)()(mockPage, ...injectsWithoutPipe, {brand: 'Pipe', value: 'injects()()() test value'})

    const {inject: mockInject} = require('botmation/actions/inject')
    expect(mockInject).toHaveBeenNthCalledWith(1, 'higher-order-database-name', 1, 'higher-order-store-name')
    expect(mockInject).toHaveBeenNthCalledWith(2, 'higher-order-database-name', 1, 'higher-order-store-name')
    expect(mockInject).toHaveBeenNthCalledWith(3, 'higher-order-database-name', 1, 'higher-order-store-name')

    expect(mockInject3rdCall).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: undefined})
    expect(mockInject3rdCall).toHaveBeenNthCalledWith(2, {}, 25, 'hi', 'World', {brand: 'Pipe', value: undefined})
    expect(mockInject3rdCall).toHaveBeenNthCalledWith(3, {}, 25, 'hi', 'World', {brand: 'Pipe', value: 'injects()()() test value'})
  })

  //
  // Basic Integration Tests
  //  - testing param support via higher order function call or injects
  //    - higher order values override corresponding injected values
  it('setIndexedDBValue() should call Page.evaluate() with a helper function and the correct values for key, value, storeName, databaseName, and databaseVersion', async() => {
    // no injects, all values come from higher order
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage)

    // varying BotIndexedDBInjects, all values come from higher order
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName)

    // Full BotIndexedDBInjects with Pipe for `key`, higher order key overrides pipe provided
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: injectedPipeParamKey})
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseVersion, higherOrderDatabaseName)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // No higher order, so key & values comes from Pipe, other values from injects
    await setIndexedDBValue()(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}})

    // Mixes of higher order and injects
    await setIndexedDBValue(higherOrderParamKey)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: injectedPipeParamValue})
    await setIndexedDBValue(higherOrderParamKey)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName, {brand: 'Pipe', value: {value: injectedPipeParamValue}})

    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName)(mockPage, injectDatabaseName, injectDatabaseVersion)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseVersion)(mockPage, injectDatabaseName)

    // missing everything, safe fallbacks
    await setIndexedDBValue()(mockPage)

    // expectations
    // higher order values override
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(4, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(5, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(6, expect.any(Function), 'higher-order-database-name', 1, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(7, expect.any(Function), 'inject-database-name', 2, 'inject-store-name', 'pipe-key', 'pipe-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(8, expect.any(Function), 'inject-database-name', 2, 'inject-store-name', 'higher-order-key', 'pipe-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(9, expect.any(Function), 'inject-database-name', 2, 'inject-store-name', 'higher-order-key', 'pipe-value') // ?

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(10, expect.any(Function), 'inject-database-name', 2, 'inject-store-name', 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(11, expect.any(Function), 'inject-database-name', 2, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(12, expect.any(Function), 'inject-database-name', 1, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(13, expect.any(Function), 'missing-db-name', 1, 'missing-store', 'missing-key', 'missing-value')
  })

  it('getIndexedDBValue() should call Page.evaluate() with a helper function and the correct values for key, storeName, databaseName, and databaseVersion', async() => {
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

    // Mixes of higher order and injects
    await getIndexedDBValue(higherOrderParamKey)(mockPage, injectDatabaseName, injectDatabaseVersion, injectStoreName)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName)(mockPage, injectDatabaseName, injectDatabaseVersion)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseVersion)(mockPage, injectDatabaseName)

    // missing everything, safe fallbacks
    await getIndexedDBValue()(mockPage)

    // expectations
    // higher order values override
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

  // E2E Test
  // E2E test was resulting in a false fail from an error, see Issue: https://github.com/smooth-code/jest-puppeteer/issues/311
  // it('should set a key/value pair in a new Database & Store, then update that value and get it again', async() => {
  //   await setIndexedDBValue('a-key', 'a-value', 'a-store', 1, 'a-db')(page)
  //   expect(getIndexedDBValue('a-key', 'a-store', 1, 'a-db')(page)).resolves.toEqual('a-value')

  //   await setIndexedDBValue('a-key', 'b-value', 'a-store', 1, 'a-db')(page)
  //   expect(getIndexedDBValue('a-key', 'a-store', 1, 'a-db')(page)).resolves.toEqual('b-value')

  //   // if you were to add a new key/value pair, that would change the schema, therefore need to bump up db version number
  // })
  
  afterAll(() => {
    jest.unmock('botmation/actions/inject')
  })
})
