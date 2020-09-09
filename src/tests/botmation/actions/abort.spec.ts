import { Page } from 'puppeteer'

import { abort, abortPipe } from 'botmation/actions/abort'
import { createCasesSignal } from 'botmation/helpers/cases'
import { createEmptyPipe, wrapValueInPipe } from 'botmation/helpers/pipe'

jest.mock('botmation/helpers/abort', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('botmation/helpers/abort')

  const originalCreateAbortLineSignal = originalModule.createAbortLineSignal

  return {
    // __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    createAbortLineSignal: jest.fn((assembledLines, pipeValue) => originalCreateAbortLineSignal(assembledLines, pipeValue))
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

  //
  // pipeAbort unit-test -> send an AbortLineSignal(1, abortLineSignal.pipeValue?) if the mapFunction(pipeValue) equals true
  it('pipeAbort()() returns an AbortLineSignal(1) with pipeValue provided if the provided conditional callback returns truthy (true) after passed the pipeValue', async() => {
    const conditionalCBTrue = () => true
    const conditionalCBFalse = () => false

    const {createAbortLineSignal} = jest.requireActual('botmation/helpers/abort')

    const pipeAborted = await abortPipe(conditionalCBTrue, 'pipe-value')(mockPage, createEmptyPipe())
    expect(pipeAborted).toEqual(createAbortLineSignal(1, 'pipe-value'))

    const pipeDoesNotAbort = await abortPipe(conditionalCBFalse)(mockPage, wrapValueInPipe('pipe-value-2'))
    expect(pipeDoesNotAbort).toEqual(createCasesSignal())

    const pipeAbortedNumericCase = await abortPipe(100, 'it was 100')(mockPage, wrapValueInPipe(100))
    expect(pipeAbortedNumericCase).toEqual(createAbortLineSignal(1, 'it was 100'))

    const pipeNotAbortNumericCase = await abortPipe(100, 'it was 100')(mockPage, wrapValueInPipe(10))
    expect(pipeNotAbortNumericCase).toEqual(createCasesSignal())
  })

  // Clean up
  afterAll(async() => {
    jest.unmock('botmation/helpers/abort')
  })
})
