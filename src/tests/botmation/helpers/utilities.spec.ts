import { sleep } from 'botmation/helpers/utilities'

/**
 * @description   Helpers: Utilities
 */
describe('[Botmation] helpers/utilities', () => {
  let setTimeoutFn = setTimeout

  afterAll(() => {
      // the test mocks the global setTimeout, so restore
      // it to original value after the test completes
      global.setTimeout = setTimeoutFn
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

})
