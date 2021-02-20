import { Page } from 'puppeteer'

import { givenThat } from './branching'
import { click, type } from './input'

import { BotAction } from './../interfaces/bot-actions'
import { abort } from './abort'
import { createAbortLineSignal } from './../helpers/abort'

/**
 * @description   Branching BotActions
 *                The factory methods here return BotAction's for the bots to handle more complex functional flows
 */
describe('[Botmation] actions/branching', () => {

  let mockPage: Page

  beforeEach(() => {
    mockPage = {
      click: jest.fn(),
      keyboard: {
        type: jest.fn()
      },
      url: jest.fn(() => ''),
      goto: jest.fn()
    } as any as Page
  })

  //
  // givenThat() Unit Tests
  it('givenThat() should resolve the condition and ONLY run the chain of actions if the resolved condition equals TRUE', async() => {
    const conditionResolvingTRUE:BotAction<boolean> = async() => Promise.resolve(true)
    const conditionResolvingFALSE:BotAction<boolean> = async() => Promise.resolve(false)

    // These actions should run
    await givenThat(conditionResolvingTRUE)(
      click('example selector 1'),
      type('example copy 1')
    )(mockPage)

    // These actions should NOT run
    await givenThat(conditionResolvingFALSE)(
      click('example selector 2'),
      type('example copy 2')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'example selector 1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example copy 1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(2, 'example selector 2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(2, 'example copy 2')
  })

  it('givenThat() should pass through the correct AbortLineSignal', async() => {
    const conditionResolveTrue: BotAction<boolean> = async() => Promise.resolve(true)
    const mockAction = jest.fn(() => Promise.resolve())

    const abortInfinite = await givenThat(conditionResolveTrue)(
      abort(0), mockAction
    )(mockPage)

    expect(abortInfinite).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })

    const abortMultiple = await givenThat(conditionResolveTrue)(
      abort(5), mockAction
    )(mockPage)

    expect(abortMultiple).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 4
    })

    // breaks inside assembly, then returns undefined
    const abortOneWithPipeValue = await givenThat(conditionResolveTrue)(
      abort(1), mockAction
    )(mockPage)

    expect(abortOneWithPipeValue).toBeUndefined()

    // test PipeValue
    const abortTwoWithPipeValue = await givenThat(conditionResolveTrue)(
      abort(2, 'test-pipe-value'), mockAction
    )(mockPage)

    expect(abortTwoWithPipeValue).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 1,
      pipeValue: 'test-pipe-value'
    })

    // make sure that mockAction was not called
    expect(mockAction).not.toHaveBeenCalled()

    // conditionalBotAction returning AbortLineSignal handling
    const mockNeverRanAction = jest.fn(() => Promise.resolve())
    const conditionAborts1Line: BotAction<boolean> = async () => Promise.resolve(createAbortLineSignal() as any as boolean)
    const conditionAbortsInfiniteLines: BotAction<boolean> = async () => Promise.resolve(createAbortLineSignal(0) as any as boolean)
    const conditionAbortsMultipleLinesWithPipeValue: BotAction<boolean> = async () => Promise.resolve(createAbortLineSignal(5, 'some-pipe-value') as any as boolean)

    const aborts1LineResult = await givenThat(conditionAborts1Line)(mockNeverRanAction)(mockPage)
    const abortsInfiniteLinesResult = await givenThat(conditionAbortsInfiniteLines)(mockNeverRanAction)(mockPage)
    const abortsMultipleLinesResult = await givenThat(conditionAbortsMultipleLinesWithPipeValue)(mockNeverRanAction)(mockPage)

    expect(mockNeverRanAction).not.toHaveBeenCalled()

    expect(aborts1LineResult).toBeUndefined()
    expect(abortsInfiniteLinesResult).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
    expect(abortsMultipleLinesResult).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 4,
      pipeValue: 'some-pipe-value'
    })
  })

})
