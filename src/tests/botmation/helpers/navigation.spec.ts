
import { DirectNavigationOptions } from 'puppeteer'
import { enrichGoToPageOptions, sleep } from 'botmation/helpers/navigation'

/**
 * @description   Navigation Helpers
 */
describe('[Botmation] helpers/navigation', () => {
  let setTimeoutFn = setTimeout

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
    global.setTimeout = (fn: Function, milliseconds: number) => {
        mockSetTimeout(milliseconds)
        return fn()
    }

    await sleep(1337)

    expect(mockSetTimeout).toHaveBeenCalledWith(1337)
  })

  afterAll(() => {
    // the test mocks the global setTimeout, so restore
    // it to original value after the test completes
    global.setTimeout = setTimeoutFn
  })

})
