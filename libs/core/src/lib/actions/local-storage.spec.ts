import { BASE_URL } from './../mocks'
import {
  clearAllLocalStorage,
  removeLocalStorageItem,
  setLocalStorageItem,
  getLocalStorageItem
} from './local-storage'

const puppeteer = require('puppeteer')
import { Page, Browser } from 'puppeteer'

/**
 * @description   Local-Storage BotAction's
 */
describe('[Botmation] actions/local-storage', () => {
  let browser: Browser
  let page: Page

  let mockPage: Page

  // Function sources for the key & value support both higher-order param and Pipe.value
  const higherOrderParamKey = 'higher-order-key'
  const higherOrderParamValue = 'higher-order-value'

  const injectedPipeParamKey = 'pipe-key'
  const injectedPipeParamValue = 'pipe-value'

  beforeAll(async() => {
    browser = await puppeteer.launch()
  })

  beforeEach(() => {
    mockPage = {
      evaluate: jest.fn()
    } as any as Page
  })

  afterAll(async() => {
    await browser.close()
  })

  //
  // Basic Integration Tests
  //  - a lot of this is testing the feature of param support for key/value
  //    - key/value can be set through higher-order function call params which are the ultimate truth OR can be ignored and instead be paired in an object as a Pipe value
  //  - Higher Order Params (key or value) will always override the Injected key or value
  it('clearAllLocalStorage() should call Page.evaluate() with a helper function', async() => {
    await clearAllLocalStorage(mockPage)

    expect(mockPage.evaluate).toHaveBeenCalledWith(expect.any(Function))
  })

  it('removeLocalStorageItem() should call Page.evaluate() with a helper function and the correct value for `key`', async() => {
    // No injects, key comes from higher order func call
    await removeLocalStorageItem(higherOrderParamKey)(mockPage)

    // Injects have Pipe with key, but higher order func call param overloads it
    await removeLocalStorageItem(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: injectedPipeParamKey})
    await removeLocalStorageItem(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // Injects provide the key param
    await removeLocalStorageItem()(mockPage, {brand: 'Pipe', value: injectedPipeParamKey})
    await removeLocalStorageItem()(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // no key, nothing
    await removeLocalStorageItem()(mockPage)

    // Expectations - higher-order key overwrites pipe-key
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(4, expect.any(Function), 'pipe-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(5, expect.any(Function), 'pipe-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(6, expect.any(Function), 'missing-key') // in case dev does not give key at all, it will provide this instead to safely error out
  })

  it('setLocalStorageItem() should call Page.evaluate() with a helper function and the correct values for `key` and `value`', async() => {
    // No injects, key/value comes from higher order func call
    await setLocalStorageItem(higherOrderParamKey, higherOrderParamValue)(mockPage)

    // higher order key, value through Pipe
    await setLocalStorageItem(undefined, higherOrderParamValue)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // injects value, key through Pipe (1 object for case of supporting Piping both key/value, and the other just value, no object for the case of shorter path in Piping key (not possible for value, in this particular BotAction)
    await setLocalStorageItem(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: {value: injectedPipeParamValue}})
    await setLocalStorageItem(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: injectedPipeParamValue})

    // key/value through Pipe, no higher order param
    await setLocalStorageItem()(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}})

    // nothing at all, safe fallbacks for key/value
    await setLocalStorageItem()(mockPage)

    // Injects have Pipe with value, but higher order func call param overloads that value, without a higher-order key
    await setLocalStorageItem(undefined, higherOrderParamValue)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}}) // key comes from injects, value ultimately comes from higher order

    // Injects have Pipe with both key/value, but higher order func call param overloads the key
    await setLocalStorageItem(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey, value: injectedPipeParamValue}}) // key ultimately comes from higher order, value comes from Pipe

    // Expectations - higher-order params overwrites Pipe provided ones, always
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'higher-order-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'pipe-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), 'higher-order-key', 'pipe-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(4, expect.any(Function), 'higher-order-key', 'pipe-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(5, expect.any(Function), 'pipe-key', 'pipe-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(6, expect.any(Function), 'missing-key', 'missing-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(7, expect.any(Function), 'pipe-key', 'higher-order-value')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(8, expect.any(Function), 'higher-order-key', 'pipe-value')
  })

  it('getLocalStorageItem() should call Page.evaluate() with a helper function and the correct value for `key`', async() => {
    // no injects, key comes from higher order
    await getLocalStorageItem(higherOrderParamKey)(mockPage)

    // higher order key overrides injected Pipe key
    await getLocalStorageItem(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: injectedPipeParamKey})
    await getLocalStorageItem(higherOrderParamKey)(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // no higher order key, key comes from injected Pipe
    await getLocalStorageItem()(mockPage, {brand: 'Pipe', value: injectedPipeParamKey})
    await getLocalStorageItem()(mockPage, {brand: 'Pipe', value: {key: injectedPipeParamKey}})

    // missing everything, safe fallbacks
    await getLocalStorageItem()(mockPage)

    // expectations
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(1, expect.any(Function), 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(2, expect.any(Function), 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(3, expect.any(Function), 'higher-order-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(4, expect.any(Function), 'pipe-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(5, expect.any(Function), 'pipe-key')
    expect(mockPage.evaluate).toHaveBeenNthCalledWith(6, expect.any(Function), 'missing-key')
  })

  //
  // Unit-Tests / E2E
  //   to confirm we are calling the correct Functions. The integration tests above dont have a way to check which anonymous functions ran.., this e2e helps confirm they are called
  it('should set a few key/value pairs, get the values by key, remove a key/value pair, fail safely in trying to get that key/value and clear all key/value pairs', async() => {
    // Puppeteer page, load some URL
    page = await browser.newPage()
    await page.goto(BASE_URL)

    // 1. Create some key/value pairs in Local Storage
    await setLocalStorageItem('key-1', 'value-1')(page)
    await setLocalStorageItem('key-2', 'value-2')(page)
    await setLocalStorageItem('key-3', 'value-3')(page)

    // 2. Read in those newly created key/value pairs from Local Storage and test them
    await expect(getLocalStorageItem('key-1')(page)).resolves.toEqual('value-1')
    await expect(getLocalStorageItem('key-2')(page)).resolves.toEqual('value-2')
    await expect(getLocalStorageItem('key-3')(page)).resolves.toEqual('value-3')

    // 3. Remove (delete) 1 key/value pair
    await removeLocalStorageItem('key-1')(page)

    // 4. Safely returns null if key not found?
    await expect(getLocalStorageItem('key-1')(page)).resolves.toEqual(null)

    // 5. Clear all
    await clearAllLocalStorage(page)

    // 6. Are any of those keys not returning null?
    await expect(getLocalStorageItem('key-1')(page)).resolves.toEqual(null)
    await expect(getLocalStorageItem('key-2')(page)).resolves.toEqual(null)
    await expect(getLocalStorageItem('key-3')(page)).resolves.toEqual(null)

    await page.close()
  })
})
