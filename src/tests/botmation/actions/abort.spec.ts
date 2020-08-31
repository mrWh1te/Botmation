import { Page } from 'puppeteer'

import { abort } from 'botmation/actions/abort'

jest.mock('botmation/helpers/abort', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('botmation/helpers/abort')

  return {
    // __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    createAbortLineSignal: jest.fn()
  }
})

/**
 * @description   Abort BotAction
 */
describe('[Botmation] actions/abort', () => {

  const mockPage: Page = {} as any as Page

  // Integration test - unit test bypassed since it's covered by the helper's unit test, we need to be sure we integrate with that unit of code correctly
  it('abort() should call createAbortLineSignal() to maintain AbortLineSignal\'s interface', async() => {
    await abort()(mockPage)
    await abort(4)(mockPage)
    await abort(7, 'abort-integration-test')(mockPage)
    
    const {createAbortLineSignal: mockCreateAbortLineSignal} = require('botmation/helpers/abort')

    expect(mockCreateAbortLineSignal).toHaveBeenNthCalledWith(1, 1, undefined)
    expect(mockCreateAbortLineSignal).toHaveBeenNthCalledWith(2, 4, undefined)
    expect(mockCreateAbortLineSignal).toHaveBeenNthCalledWith(3, 7, 'abort-integration-test')
  })

  // Clean up
  afterAll(async() => {
    jest.unmock('botmation/helpers/abort')
  })
})
