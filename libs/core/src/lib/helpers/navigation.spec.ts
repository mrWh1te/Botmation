
import { DirectNavigationOptions } from 'puppeteer'
import { enrichGoToPageOptions, sleep, scrollToElement } from './navigation'

const mockScrollIntoView = jest.fn()
const mockQuerySelectorFactory = (timesRan = 0) => jest.fn(() => {
  if (timesRan === 0) {
    timesRan++
    return {
      scrollIntoView: mockScrollIntoView
    }
  } else {
    return null // for the case of not element found, querySelector() returns null
  }
})

const mockQuerySelector = mockQuerySelectorFactory()

// Setup document query selector methods
Object.defineProperty(global, 'document', {
  value: {
    querySelector: mockQuerySelector,
    addEventListener: () => {}
  }
})

/**
 * @description   Navigation Helpers
 */
describe('[Botmation] helpers/navigation', () => {
  let setTimeoutFn = setTimeout

  it('scrollToElement() is a function evaluated in the browser the gets an element based on html selector then calls its scrollIntoView() method', () => {
    scrollToElement('teddy bear')

    // 1st time running mock document object, it will have a scrollIntoView function
    expect(mockQuerySelector).toHaveBeenNthCalledWith(1, 'teddy bear')
    expect(mockScrollIntoView).toHaveBeenNthCalledWith(1, {behavior: 'smooth'})

    // subsequent calls of mock document object querySelector will result in null
    scrollToElement('blanket')

    expect(mockQuerySelector).toHaveBeenNthCalledWith(2, 'blanket')
    expect(mockScrollIntoView).not.toHaveBeenCalledTimes(2)
  })

  it('enrichGoToPageOptions() should take a partial of Puppeteer.DirectNavigationOptions to overload the default values it provides in one as a safe fallback', () => {
    const directNavigationOptionsEmpty: Partial<DirectNavigationOptions> = {}
    const directNavigationOptionsWaitUntil: Partial<DirectNavigationOptions> = {waitUntil: 'domcontentloaded'}

    const enrichDirectNavigationOptionsFromUndefined = enrichGoToPageOptions()
    const enrichDirectNavigationOptionsFromEmpty = enrichGoToPageOptions(directNavigationOptionsEmpty)
    const enrichDirectNavigationOptionsFromWaitUntil = enrichGoToPageOptions(directNavigationOptionsWaitUntil)

    // default cases (safe fallbacks)
    expect(enrichDirectNavigationOptionsFromUndefined).toEqual({
      waitUntil: 'networkidle0'
    })
    expect(enrichDirectNavigationOptionsFromEmpty).toEqual({
      waitUntil: 'networkidle0'
    })

    // overwriting default
    expect(enrichDirectNavigationOptionsFromWaitUntil).toEqual({
      waitUntil: 'domcontentloaded'
    })
  })

  //
  // sleep
  it('should return a promise for pausing execution by calling setTimeout', async () => {
    const mockSetTimeout = jest.fn()
    type setTimeoutType = typeof globalThis.setTimeout

    const mockSetTimeoutFunc = (callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout => {
      mockSetTimeout(ms)
      return callback() as any as NodeJS.Timeout
    }

    global.setTimeout = mockSetTimeoutFunc as setTimeoutType;

    await sleep(1337)

    expect(mockSetTimeout).toHaveBeenCalledWith(1337)
  })

  afterAll(() => {
    // the test mocks the global setTimeout, so restore
    // it to original value after the test completes
    global.setTimeout = setTimeoutFn
  })

})
