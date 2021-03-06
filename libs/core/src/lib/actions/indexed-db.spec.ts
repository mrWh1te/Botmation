import {
  setIndexedDBValue,
  getIndexedDBValue,
  indexedDBStore,
  deleteIndexedDB
} from './indexed-db'

import * as puppeteer from 'puppeteer'
import { pipe } from './assembly-lines'
import { INDEXEDDB_URL } from '../mocks/urls'

const mockInject3rdCall = jest.fn()
jest.mock('./inject', () => {
  const originalModule = jest.requireActual('./inject')
  return {
    ...originalModule,
    inject: jest.fn(() => () => mockInject3rdCall)
  }
})

/**
 * @description   IndexedDB BotAction's
 */
describe('[Botmation] actions/indexed-db', () => {
  let mockPage: puppeteer.Page

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

  // e2e testing
  const databaseName = 'MyTestDatabase';
  const storeName = 'TestObjectStore';
  const key = 'TestKey';
  const value = 'TestValue234';

  beforeEach(() => {
    mockPage = {
      evaluate: jest.fn()
    } as any as puppeteer.Page
  })

  it('indexedDBStore()() should set the first few injects as BotIndexedDBInjects from higher order params', async() => {
    const injectsWithoutPipe = [25, 'hi', 'World']
    mockPage = {} as any as puppeteer.Page

    await indexedDBStore(higherOrderDatabaseName, higherOrderStoreName, higherOrderDatabaseVersion)()(mockPage)
    await indexedDBStore(higherOrderDatabaseName, higherOrderStoreName, higherOrderDatabaseVersion)()(mockPage, ...injectsWithoutPipe)
    await indexedDBStore(higherOrderDatabaseName, higherOrderStoreName, higherOrderDatabaseVersion)()(mockPage, ...injectsWithoutPipe, {brand: 'Pipe', value: 'injects()()() test value'})

    const {inject: mockInject} = require('./inject')
    expect(mockInject).toHaveBeenNthCalledWith(1, 1, 'higher-order-database-name', 'higher-order-store-name')
    expect(mockInject).toHaveBeenNthCalledWith(2, 1, 'higher-order-database-name', 'higher-order-store-name')
    expect(mockInject).toHaveBeenNthCalledWith(3, 1, 'higher-order-database-name', 'higher-order-store-name')

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
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage)

    // varying BotIndexedDBInjects, all values come from higher order
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName)

    // Full BotIndexedDBInjects with Pipe for `key`, higher order key overrides pipe provided
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: injectedPipeParamKey})
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // No higher order, so key & values comes from Pipe, other values from injects
    await setIndexedDBValue()(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}})

    // Mixes of higher order and injects
    await setIndexedDBValue(higherOrderParamKey)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: injectedPipeParamValue})
    await setIndexedDBValue(higherOrderParamKey)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: {value: injectedPipeParamValue}})

    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName)(mockPage, injectDatabaseVersion, injectDatabaseName)
    await setIndexedDBValue(higherOrderParamKey, higherOrderParamValue, higherOrderStoreName, higherOrderDatabaseName)(mockPage, injectDatabaseVersion)

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
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(12, expect.any(Function), 'higher-order-database-name', 2, 'higher-order-store-name', 'higher-order-key', 'higher-order-value')

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(13, expect.any(Function), 'missing-db-name', undefined, 'missing-store', 'missing-key', 'missing-value')
  })

  it('getIndexedDBValue() should call Page.evaluate() with a helper function and the correct values for key, storeName, databaseName, and databaseVersion', async() => {
    // no injects, all values come from higher order
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage)

    // varying BotIndexedDBInjects, all values come from higher order
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName)

    // Full BotIndexedDBInjects with Pipe for `key`, higher order key overrides pipe provided
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: injectedPipeParamKey})
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseName, higherOrderDatabaseVersion)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // No higher order, so key comes from Pipe, other values from injects
    await getIndexedDBValue()(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: injectedPipeParamKey})
    await getIndexedDBValue()(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // Mixes of higher order and injects
    await getIndexedDBValue(higherOrderParamKey)(mockPage, injectDatabaseVersion, injectDatabaseName, injectStoreName)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName)(mockPage, injectDatabaseVersion, injectDatabaseName)
    await getIndexedDBValue(higherOrderParamKey, higherOrderStoreName, higherOrderDatabaseName)(mockPage, injectDatabaseVersion)

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
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(11, expect.any(Function), 'higher-order-database-name', 2, 'higher-order-store-name', 'higher-order-key')

    expect(mockPage.evaluate).toHaveBeenNthCalledWith(12, expect.any(Function), 'missing-db-name', undefined, 'missing-store', 'missing-key')
  })

  //
  // e2e test
  it('should be able to set & delete a key->value pair from an indexeddb, and delete a database from indexeddb using these botactions', async() => {
    const db1Exists = `(async() => {
      const dbs = await window.indexedDB.databases();
      return dbs.map(db => db.name).includes("${databaseName}");
    })()`
    const db2Exists = `(async() => {
      const dbs = await window.indexedDB.databases();
      return dbs.map(db => db.name).includes("MySecondDatabase");
    })()`

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(INDEXEDDB_URL)

    // "MyTestDatabase"
    const result = await pipe()(
      setIndexedDBValue('new-key', 'new-value', storeName, databaseName),
      getIndexedDBValue('new-key', storeName, databaseName)
    )(page)
    const result2 = await pipe()(
      getIndexedDBValue(key, storeName, databaseName)
    )(page)

    expect(result).toEqual('new-value')
    expect(result2).toEqual(value)
    const result21 = await page.evaluate(db1Exists, databaseName)
    expect(result21).toEqual(true)

    await deleteIndexedDB(databaseName)(page)
    const result22 = await page.evaluate(db1Exists, databaseName)
    expect(result22).toEqual(false)

    // "MySecondDatabase"
    const result3 = await page.evaluate(db2Exists)
    expect(result3).toEqual(true)

    await deleteIndexedDB()(page, undefined, 'MySecondDatabase') // simulate indexedDBStore()() HO assembling that injects db name
    const result4 = await page.evaluate(db2Exists)
    expect(result4).toEqual(false)

    await page.close()
    await browser.close()
  })

  afterAll(() => {
    jest.unmock('./inject')
  })
})
