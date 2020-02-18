import { sleep } from 'botmation/helpers/utilities'

/**
 * @description   Helpers: Assets (ie screenshots, cookies)
 */
describe('[Botmation:Helpers] Utilities', () => {
  let setTimeoutFn = setTimeout

  afterAll(() => {
      global.setTimeout = setTimeoutFn
  })

  //
  // sleep
  it('should return a promise for pausing execution (bot action wait() relies on this)', async () => {
    const mockSetTimeout = jest.fn()
    global.setTimeout = (fn: Function, milliseconds: number) => {
        mockSetTimeout(milliseconds)
        return fn()
    }

    await sleep(1337)

    expect(mockSetTimeout).toHaveBeenCalledWith(1337)
  })

})
