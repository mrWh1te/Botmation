import { Page } from 'puppeteer'

import { map, pipeValue, emptyPipe, pipeCase } from 'botmation/actions/pipe'
import { createAbortLineSignal } from 'botmation/helpers/abort'
import { wrapValueInPipe } from 'botmation/helpers/pipe'
import { abort } from 'botmation/actions/abort'
import { createMatchesSignal } from 'botmation/helpers/matches'

/**
 * @description   Pipe BotAction's
 */
describe('[Botmation] actions/pipe', () => {

  let mockPage: Page

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  // Basic Unit Tests
  it('map() should run a function against the Pipe value then return the new value', async() => {
    const testMapFunction = jest.fn()
    await map(testMapFunction)(page, {brand: 'Pipe'})
    expect(testMapFunction).toHaveBeenCalledTimes(1)

    // example with number value
    const multiplyNumberByTwo = (x: number) => x*2

    await expect(map<number>(multiplyNumberByTwo)({} as Page, {brand: 'Pipe', value: 5})).resolves.toEqual(10)
    await expect(map<number>(multiplyNumberByTwo)({} as Page, {brand: 'Pipe'})).resolves.toEqual(NaN)
    await expect(map<number>(multiplyNumberByTwo)({} as Page)).resolves.toEqual(NaN)
  })

  it('pipeValue() should return the value given', async() => {
    await expect(pipeValue(22)({} as Page)).resolves.toEqual(22)
    await expect(pipeValue(undefined)({} as Page)).resolves.toEqual(undefined)
  })
  
  it('emptyPipe() returns undefined', async() => {
    await expect(emptyPipe({} as Page)).resolves.toEqual(undefined)
  })

  //
  // pipeCase() Unit Test
  it('pipeCase()() should run assembled BotActions only if a value to test matches the pipe object value or if a value is a function then used as callback to evaluate for truthy with pipe object value as function param', async() => {
    // these mock actions act like log() where they return the pipe object value
    const mockActionRuns = jest.fn((p, pO) => Promise.resolve(pO.value))
    const mockActionDoesntRun = jest.fn((p, pO) => Promise.resolve(pO.value))

    // no matches - no injected pipe
    const noMatchesNoPipe = await pipeCase(4, 6)(
      mockActionDoesntRun
    )(mockPage)

    expect(noMatchesNoPipe).toEqual({
      brand: 'Matches_Signal',
      matches: {},
    })
    expect(mockActionDoesntRun).not.toHaveBeenCalled()

    // no matches - with injected pipe
    const noMatchesWithPipe = await pipeCase(77, 123)(
      mockActionDoesntRun
    )(mockPage, wrapValueInPipe(44))

    expect(noMatchesWithPipe).toEqual({
      brand: 'Matches_Signal',
      matches: {},
    })
    expect(mockActionDoesntRun).not.toHaveBeenCalled()

    // single numerical match - with injected pipe
    const singleNumericalMatch = await pipeCase(3, 7, 18)(
      mockActionRuns
    )(mockPage, wrapValueInPipe(7))

    expect(singleNumericalMatch).toEqual({
      brand: 'Matches_Signal',
      matches: {
        '1': 7 // index 1, value 7
      },
      pipeValue: 7 // mockActionRuns returns pipe object value
    })
    expect(mockActionRuns).toHaveBeenCalledTimes(1)

    // multiple matches via functions - with injected pipe
    const trueForOneOrTen = (value: number): boolean => value === 1 || value === 10
    const trueForTwoOrFive = (value: number): boolean => value === 2 || value === 5
    const trueForTwoOrSix = (value: number): boolean => value === 2 || value === 6

    const multiNumericalMatches = await pipeCase(trueForOneOrTen, trueForTwoOrFive, trueForTwoOrSix, 2)(
      mockActionRuns
    )(mockPage, wrapValueInPipe(2))

    expect(multiNumericalMatches).toEqual({
      brand: 'Matches_Signal',
      matches: {
        1: expect.any(Function),
        2: expect.any(Function),
        3: 2
      },
      pipeValue: 2 // mockActionRuns returns pipe object value
    })
    expect(mockActionRuns).toHaveBeenCalledTimes(2)
  })

  it('pipeCase() supports the AbortLineSignal similar to givenThat() in which its considered one line to abort', async() => {
    const abortedInfiniteLine = await pipeCase(10)(
      abort(0)
    )(mockPage, wrapValueInPipe(10))

    expect(abortedInfiniteLine).toEqual(createAbortLineSignal(0))

    const abortedSingleLine = await pipeCase(100)(
      abort(1, 'an aborted pipe value')
    )(mockPage, wrapValueInPipe(100))

    expect(abortedSingleLine).toEqual(createMatchesSignal({'0': 100}, 'an aborted pipe value'))

    const abortedMultiLine = await pipeCase(1000)(
      abort(2, 'another aborted pipe value')
    )(mockPage, wrapValueInPipe(1000))

    expect(abortedMultiLine).toEqual(createAbortLineSignal(1, 'another aborted pipe value'))
  })
})
