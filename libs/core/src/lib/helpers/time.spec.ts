
import { sleep } from './time'

/**
 * @description   Time Helpers
 */
describe('[Botmation] helpers/time', () => {
  let setTimeoutFn = setTimeout

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
