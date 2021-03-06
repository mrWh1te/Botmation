import { Page } from 'puppeteer'

import { abort, abortPipe, restart } from './abort'
import { createCasesSignal } from './../helpers/cases'
import { createEmptyPipe, wrapValueInPipe } from './../helpers/pipe'

jest.mock('../helpers/abort', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../helpers/abort')

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

    const {createAbortLineSignal: mockCreateAbortLineSignal} = require('../helpers/abort')

    expect(mockCreateAbortLineSignal).toHaveBeenNthCalledWith(1, 1, undefined)
    expect(mockCreateAbortLineSignal).toHaveBeenNthCalledWith(2, 4, undefined)
    expect(mockCreateAbortLineSignal).toHaveBeenNthCalledWith(3, 7, 'abort-integration-test')
  })

  //
  // pipeAbort unit-test -> send an AbortLineSignal(1, abortLineSignal.pipeValue?) if the mapFunction(pipeValue) equals true
  it('pipeAbort()() returns an AbortLineSignal(1) with pipeValue provided if the provided conditional callback returns truthy (true) after passed the pipeValue', async() => {
    const conditionalCBTrue = () => true
    const conditionalCBFalse = () => false

    const {createAbortLineSignal} = jest.requireActual('../helpers/abort')

    const pipeAborted = await abortPipe(conditionalCBTrue, 'pipe-value')(mockPage, createEmptyPipe())
    expect(pipeAborted).toEqual(createAbortLineSignal(1, 'pipe-value'))

    const pipeDoesNotAbort = await abortPipe(conditionalCBFalse)(mockPage, wrapValueInPipe('pipe-value-2'))
    expect(pipeDoesNotAbort).toEqual(createCasesSignal({}, false, 'pipe-value-2'))

    const pipeAbortedNumericCase = await abortPipe(100, 'it was 100')(mockPage, wrapValueInPipe(100))
    expect(pipeAbortedNumericCase).toEqual(createAbortLineSignal(1, 'it was 100'))

    const pipeNotAbortNumericCase = await abortPipe(100, 'it was 100')(mockPage, wrapValueInPipe(10))
    expect(pipeNotAbortNumericCase).toEqual(createCasesSignal({}, false, 10))
  })

  //
  // restart
  it('restart() should rerun actions once if assembled botactions returns an AbortLineSignal once with assembledLines of 1', async() => {
    const {createAbortLineSignal} = jest.requireActual('../helpers/abort')

    let abortCount = 0;
    const dynamicAbort = async() => {
      abortCount++;
      if (abortCount === 1) {
        return createAbortLineSignal(1, 'we need to retry these actions with this initial pipe value instead')
      }
    }
    const mockAction = jest.fn(async(p, { value }) => Promise.resolve(value))
    const mockActionReturnsValue = jest.fn(async() => Promise.resolve(42)) // 42 is the answer

    const result = await restart(mockAction, dynamicAbort, mockActionReturnsValue, mockAction)(mockPage, wrapValueInPipe('start'))

    expect(mockAction).toHaveBeenNthCalledWith(1, mockPage, wrapValueInPipe('start'))
    expect(mockAction).toHaveBeenNthCalledWith(2, mockPage, wrapValueInPipe('we need to retry these actions with this initial pipe value instead'))
    expect(mockAction).toHaveBeenCalledTimes(3);
    expect(mockAction).toHaveBeenNthCalledWith(3, mockPage, wrapValueInPipe(42))
    expect(mockActionReturnsValue).toHaveBeenCalledTimes(1);
    expect(result).toEqual(42)
  })

  it('restart() should not rerun actions, but abort when a AbortLineSignal\'s assembledLines is 2 or greater', async() => {
    const {createAbortLineSignal} = jest.requireActual('../helpers/abort')

    const minimumAbort = async() => createAbortLineSignal(2, 'minimum to fully abort')
    const infiniteAbort = async() => createAbortLineSignal(0, 'infinity abort')
    const highCountAbort = async() => createAbortLineSignal(542, 'big number')

    const result1 = await restart(minimumAbort)(mockPage)
    const result2 = await restart(infiniteAbort)(mockPage)
    const result3 = await restart(highCountAbort)(mockPage)

    expect(result1).toEqual('minimum to fully abort')
    expect(result2).toEqual(createAbortLineSignal(0, 'infinity abort'))
    expect(result3).toEqual(createAbortLineSignal(540, 'big number'))
  })

  // Clean up
  afterAll(async() => {
    jest.unmock('../helpers/abort')
  })
})
