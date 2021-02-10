import { Page } from 'puppeteer'

import { map, pipeValue, emptyPipe, pipeCase, pipeCases } from '@botmation/core'
import { createAbortLineSignal } from '@botmation/core'
import { wrapValueInPipe } from '@botmation/core'
import { abort } from '@botmation/core'
import { createCasesSignal } from '@botmation/core'
import { BASE_URL } from '@botmation/test'

import * as puppeteer from 'puppeteer'

/**
 * @description   Pipe BotAction's
 */
describe('[Botmation] actions/pipe', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  let mockPage: Page

  beforeAll(async() => {
    browser = await puppeteer.launch()
  })

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  afterAll(async() => {
    await browser.close()
  })

  // Basic Unit Tests
  it('map() should run a function against the Pipe value then return the new value', async() => {
    page = await browser.newPage()
    await page.goto(BASE_URL)

    const testMapFunction = jest.fn()
    await map(testMapFunction)(page, {brand: 'Pipe'})
    expect(testMapFunction).toHaveBeenCalledTimes(1)

    // example with number value
    const multiplyNumberByTwo = (x: number) => x*2

    await expect(map<number>(multiplyNumberByTwo)({} as Page, {brand: 'Pipe', value: 5})).resolves.toEqual(10)
    await expect(map<number>(multiplyNumberByTwo)({} as Page, {brand: 'Pipe'})).resolves.toEqual(NaN)
    await expect(map<number>(multiplyNumberByTwo)({} as Page)).resolves.toEqual(NaN)

    await page.close()
  })

  it('pipeValue() should return the value given', async() => {
    await expect(pipeValue(22)({} as Page)).resolves.toEqual(22)
    await expect(pipeValue(undefined)({} as Page)).resolves.toEqual(undefined)
  })

  it('emptyPipe() returns undefined', async() => {
    await expect(emptyPipe({} as Page)).resolves.toEqual(undefined)
  })

  //
  // pipeCase() Unit Test || || || (at least one case passes)
  it('pipeCase()() should run assembled BotActions only if a value to test matches the pipe object value or if a value is a function then used as callback to evaluate for truthy with pipe object value as function param', async() => {
    // these mock actions act like log() where they return the pipe object value
    const mockActionRuns = jest.fn((p, pO) => Promise.resolve(pO.value))
    const mockActionDoesntRun = jest.fn((p, pO) => Promise.resolve(pO.value))

    // no matches - no injected pipe
    const noMatchesNoPipe = await pipeCase(4, 6)(
      mockActionDoesntRun
    )(mockPage)

    expect(noMatchesNoPipe).toEqual(createCasesSignal())
    expect(mockActionDoesntRun).not.toHaveBeenCalled()

    // no matches - with injected pipe
    const noMatchesWithPipe = await pipeCase(77, 123)(
      mockActionDoesntRun
    )(mockPage, wrapValueInPipe(44))

    expect(noMatchesWithPipe).toEqual(createCasesSignal({}, false, 44))
    expect(mockActionDoesntRun).not.toHaveBeenCalled()

    // single numerical match - with injected pipe
    const singleNumericalMatch = await pipeCase(3, 7, 18)(
      mockActionRuns
    )(mockPage, wrapValueInPipe(7))

    expect(singleNumericalMatch).toEqual(createCasesSignal({
      '1': 7 // index 1, value 7
    }, true, 7))
    expect(mockActionRuns).toHaveBeenCalledTimes(1)

    // multiple matches via functions - with injected pipe
    const trueForOneOrTen = (value: number): boolean => value === 1 || value === 10
    const trueForTwoOrFive = (value: number): boolean => value === 2 || value === 5
    const trueForTwoOrSix = (value: number): boolean => value === 2 || value === 6

    const multiNumericalMatches = await pipeCase(trueForOneOrTen, trueForTwoOrFive, trueForTwoOrSix, 2)(
      mockActionRuns
    )(mockPage, wrapValueInPipe(2))

    expect(multiNumericalMatches).toEqual({
      brand: 'Cases_Signal',
      matches: {
        1: expect.any(Function),
        2: expect.any(Function),
        3: 2
      },
      conditionPass: true,
      pipeValue: 2 // mockActionRuns returns pipe object value
    })
    expect(mockActionRuns).toHaveBeenCalledTimes(2)
  })

  it('pipeCase() supports the AbortLineSignal similar to givenThat() in which its considered one line to abort', async() => {
    const abortedInfiniteLine = await pipeCase(10)(
      abort(0, 'infinite')
    )(mockPage, wrapValueInPipe(10))

    expect(abortedInfiniteLine).toEqual(createAbortLineSignal(0, 'infinite'))

    const abortedSingleLine = await pipeCase(100)(
      abort(1, 'an aborted pipe value')
    )(mockPage, wrapValueInPipe(100))

    expect(abortedSingleLine).toEqual(createCasesSignal({'0': 100}, true, 'an aborted pipe value'))

    const abortedTwoLine = await pipeCase(1000)(
      abort(2, 'another aborted pipe value')
    )(mockPage, wrapValueInPipe(1000))

    expect(abortedTwoLine).toEqual('another aborted pipe value') // breaks line, and breaks the casesignal returning flow to return a processed (again) AbortLineSignal (therefore abortLineSignal.pipeValue)

    const abortedMultiLine = await pipeCase(1000)(
      abort(3, 'another aborted pipe value 5')
    )(mockPage, wrapValueInPipe(1000))

    expect(abortedMultiLine).toEqual(createAbortLineSignal(1, 'another aborted pipe value 5'))
  })

  //
  // pipeCases() Unit Test && && && (all cases must pass)
  it('pipeCases()() should run assembled BotActions only if ALL values tested against the pipe object value are equal or if a value is a function then used as callback to evaluate for truthy with pipe object value as function param', async() => {
    // these mock actions act like log() where they return the pipe object value
    const mockActionPassThrough = jest.fn((p, pO) => Promise.resolve(pO.value))
    const mockActionDoesntRun = jest.fn(() => Promise.resolve())

    // no matches - no injected pipe
    const noMatchesNoPipe = await pipeCases(4, 6)(
      mockActionDoesntRun
    )(mockPage)

    expect(noMatchesNoPipe).toEqual(createCasesSignal())
    expect(mockActionDoesntRun).not.toHaveBeenCalled()

    // no matches - with injected pipe
    const noMatchesWithPipe = await pipeCases(77, 123)(
      mockActionDoesntRun
    )(mockPage, wrapValueInPipe(44))

    expect(noMatchesWithPipe).toEqual(createCasesSignal({}, false, 44))
    expect(mockActionDoesntRun).not.toHaveBeenCalled()

    // single numerical match - with injected pipe
    const singleNumericalMatchButDoesntGetToo = await pipeCases(3, 7, 18)(
      mockActionPassThrough
    )(mockPage, wrapValueInPipe(7))

    expect(singleNumericalMatchButDoesntGetToo).toEqual(createCasesSignal({}, false, 7))
    expect(mockActionPassThrough).toHaveBeenCalledTimes(0)

    const singleNumericalMatchThenBreak = await pipeCases(7, 3, 18)(
      mockActionPassThrough
    )(mockPage, wrapValueInPipe(7))

    expect(singleNumericalMatchThenBreak).toEqual(createCasesSignal({
      0: 7 // index 0, value 7
    }, false, 7)) // no pipe value since the assembled botactions did not run
    expect(mockActionPassThrough).toHaveBeenCalledTimes(0)

    // all matches via functions - with injected pipe
    const trueForTwoOrTen = (value: number): boolean => value === 2 || value === 10
    const trueForTwoOrFive = (value: number): boolean => value === 2 || value === 5
    const trueForTwoOrSix = (value: number): boolean => value === 2 || value === 6

    const multiNumericalMatches = await pipeCases(trueForTwoOrTen, trueForTwoOrFive, trueForTwoOrSix, 2)(
      mockActionPassThrough
    )(mockPage, wrapValueInPipe(2))

    expect(multiNumericalMatches).toEqual({
      brand: 'Cases_Signal',
      matches: {
        0: expect.any(Function),
        1: expect.any(Function),
        2: expect.any(Function),
        3: 2
      },
      conditionPass: true,
      pipeValue: 2 // mockActionRuns returns pipe object value
    })
    expect(mockActionPassThrough).toHaveBeenCalledTimes(1)

    // function matching where was is false-like to break the loop preventing following botactions from running
    const multiMatchesFunctionFalse = await pipeCases(trueForTwoOrTen, trueForTwoOrFive, trueForTwoOrSix, 2)(
      mockActionPassThrough // does not get called, so same called times as before
    )(mockPage, wrapValueInPipe(10))

    expect(multiMatchesFunctionFalse).toEqual({
      brand: 'Cases_Signal',
      matches: {
        0: expect.any(Function),
      },
      conditionPass: false,
      pipeValue: 10
    })
    expect(mockActionPassThrough).toHaveBeenCalledTimes(1)
  })

  it('pipeCases()() supports AbortLineSignal in assembled BotActions with aborting behavior, 1 line of assembledLines to abort assembled lines but still return CasesSignal and 2+ assembledLines of aborting to fully abort out of the function', async() => {
    const mockActionNotRun = jest.fn(() => Promise.resolve())

    const abortLineOne = await pipeCases(100)(
      abort(1, 'pipe-value-1'),
      mockActionNotRun
    )(mockPage, wrapValueInPipe(100))

    expect(mockActionNotRun).not.toHaveBeenCalled()
    expect(abortLineOne).toEqual(createCasesSignal({0: 100}, true, 'pipe-value-1'))

    const abortLineTwo = await pipeCases(100)(
      abort(2, 'pipe-value-to-check')
    )(mockPage, wrapValueInPipe(100))

    expect(abortLineTwo).toEqual('pipe-value-to-check')

    const abortLineThree = await pipeCases(100)(
      abort(3, 'pipe-value-3')
    )(mockPage, wrapValueInPipe(100))

    expect(abortLineThree).toEqual(createAbortLineSignal(1, 'pipe-value-3'))

    const abortInfinity = await pipeCases(100)(
      abort(0, 'infinity')
    )(mockPage, wrapValueInPipe(100))

    expect(abortInfinity).toEqual(createAbortLineSignal(0, 'infinity'))
  })

})
