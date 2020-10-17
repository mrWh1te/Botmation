import { Page } from 'puppeteer'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'
import { givenThat, forAll, doWhile, forAsLong } from 'botmation/actions/utilities'
import { click, type } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'

import { BotAction } from 'botmation/interfaces'
import { Dictionary } from 'botmation/types/objects'
import { abort } from 'botmation/actions/abort'
import { createAbortLineSignal } from 'botmation/helpers/abort'
import { AbortLineSignal } from 'botmation/types/abort-line-signal'

jest.mock('botmation/helpers/console', () => {
  return {
    logWarning: jest.fn(() => {})
  }
})

/**
 * @description   Utility BotAction's
 *                The factory methods here return BotAction's for the bots to handle more complex functional flows
 */
describe('[Botmation] actions/utilities', () => {

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
    const conditionResolvingTRUE:BotAction<boolean> = async() => new Promise(resolve => resolve(true))
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))

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
    const conditionResolveTrue: BotAction<boolean> = async() => new Promise(resolve => resolve(true))
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
    const conditionAborts1Line: BotAction<boolean> = async () => new Promise(resolve => resolve(createAbortLineSignal() as any as boolean))
    const conditionAbortsInfiniteLines: BotAction<boolean> = async () => new Promise(resolve => resolve(createAbortLineSignal(0) as any as boolean))
    const conditionAbortsMultipleLinesWithPipeValue: BotAction<boolean> = async () => new Promise(resolve => resolve(createAbortLineSignal(5, 'some-pipe-value') as any as boolean))

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

  //
  // forAll() Unit Tests
  it('forAll() should call the list of Actions for each item in the array provided through either higher-order param or Pipe object value', async() => {
    const urls = ['example.html', 'example2.html', 'success.html']

    await forAll(urls)(
      (webPage) => ([
        goTo('http://localhost:8080/' + webPage)
      ])
    )(mockPage)

    // Note given the mock, these url's don't have to be real
    expect(mockPage.url).toHaveBeenNthCalledWith(3) // called 3 times
    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'http://localhost:8080/example.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(2, 'http://localhost:8080/example2.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(3, 'http://localhost:8080/success.html', enrichGoToPageOptions())

    // reset mockPage to run same tests again except with Piping the collection
    mockPage = {
      url: jest.fn(() => ''),
      goto: jest.fn()
    } as any as Page

    await forAll()(
      (webPage) => ([
        goTo('http://localhost:8080/' + webPage)
      ])
    )(mockPage, {brand: 'Pipe', value: urls})

    // Note given the mock, these url's don't have to be real
    expect(mockPage.url).toHaveBeenNthCalledWith(3) // called 3 times
    expect(mockPage.goto).toHaveBeenNthCalledWith(1, 'http://localhost:8080/example.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(2, 'http://localhost:8080/example2.html', enrichGoToPageOptions())
    expect(mockPage.goto).toHaveBeenNthCalledWith(3, 'http://localhost:8080/success.html', enrichGoToPageOptions())

    // reset mockPage to run same tests again except with Piping the collection
    mockPage = {
      url: jest.fn(() => ''),
      goto: jest.fn()
    } as any as Page

    const {logWarning: mocklogWarning} = require('botmation/helpers/console')

    await forAll()(
      (webPage) => ([
        goTo('http://localhost:8080/' + webPage)
      ])
    )(mockPage)
    
    expect(mocklogWarning).toHaveBeenCalledTimes(1)
    expect(mocklogWarning).toHaveBeenNthCalledWith(1, 'Utilities forAll() missing collection')
    expect(mockPage.url).toHaveBeenCalledTimes(0)
    expect(mockPage.goto).toHaveBeenCalledTimes(0)

    // null case
    const mockActionDoesntRun = jest.fn(() => Promise.resolve())

    const notDictionary = await forAll(null as any as object)(
      () => mockActionDoesntRun
    )(mockPage)
    expect(notDictionary).toBeUndefined()
    expect(mockActionDoesntRun).not.toHaveBeenCalled()
  })

  it('forAll() should pass along the correct AbortLineSignal', async() => {
    //
    // array
    const numbers = [1,2,3]
    const mockActionNeverRuns = jest.fn(() => Promise.resolve())

    const infiniteAbort = await forAll(numbers)(
      () => ([
        abort(0),
        mockActionNeverRuns
      ])
    )(mockPage)

    expect(infiniteAbort).toEqual({brand: 'Abort_Signal', assembledLines: 0})
    expect(mockActionNeverRuns).not.toHaveBeenCalled()

    const mockActionRuns = jest.fn(() => Promise.resolve())
    const singleAbort = await forAll(numbers)(
      () => ([
        mockActionRuns,
        abort(1, 'bird'),
        mockActionNeverRuns
      ])
    )(mockPage)

    expect(singleAbort).toBeUndefined()
    expect(mockActionRuns).toHaveBeenCalledTimes(3)
    expect(mockActionNeverRuns).not.toHaveBeenCalled()

    const mockActionRunsOnce = jest.fn(() => Promise.resolve())
    const twoLevelAbortWithPipeValue = await forAll(numbers)(
      () => ([
        mockActionRunsOnce,
        abort(2, 'elephant'),
        mockActionNeverRuns
      ])
    )(mockPage)

    expect(twoLevelAbortWithPipeValue).toEqual('elephant')
    expect(mockActionRunsOnce).toHaveBeenCalledTimes(1)

    //
    // object with key/value pairs
    const keyValues = {
      username: 'sky',
      email: 'sky@example.com',
      home: 'earth',
      favorite_food: 'pizza',
      likesAnimals: true
    }

    const objectInfiniteAbort = await forAll(keyValues)(
      () => ([
        abort(0),
        mockActionNeverRuns
      ])
    )(mockPage)

    expect(objectInfiniteAbort).toEqual({brand: 'Abort_Signal', assembledLines: 0})
    expect(mockActionNeverRuns).not.toHaveBeenCalled()

    const objectMockActionRuns = jest.fn(() => Promise.resolve())
    const objectSingleAbort = await forAll(keyValues)(
      () => ([
        objectMockActionRuns,
        abort(1, 'bird'),
        mockActionNeverRuns
      ])
    )(mockPage)

    expect(objectSingleAbort).toBeUndefined()
    expect(objectMockActionRuns).toHaveBeenCalledTimes(5)
    expect(mockActionNeverRuns).not.toHaveBeenCalled()

    const objectMockActionRunsOnce = jest.fn(() => Promise.resolve())
    const objectTwoLevelAbortWithPipeValue = await forAll(keyValues)(
      () => ([
        objectMockActionRunsOnce,
        abort(2, 'elephant'),
        mockActionNeverRuns
      ])
    )(mockPage)

    expect(objectTwoLevelAbortWithPipeValue).toEqual('elephant')
    expect(objectMockActionRunsOnce).toHaveBeenCalledTimes(1)
    expect(mockActionNeverRuns).not.toHaveBeenCalled()
  })

  it('forAll() should call the list of Actions for each key->value pair in the object provided', async() => {
    const keyValuePairs: Dictionary = {
      'form input[name="username"]': 'example username',
      'form input[name="password"]': 'example password'
    }

    // idea of this test is for a particular use-case where provided collection is an object, 
    // whose keys are html selectors for form inputs, and the values are strings to type in
    // so it would be one data structure for doing form input[type=text], in one succinct format
    await forAll(keyValuePairs)(
      (copyToType, elementSelector) => ([
        click(elementSelector),
        type(copyToType)
      ])
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'form input[name="username"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example username')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, 'form input[name="password"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, 'example password')

    // reset mockPage to run same tests again except with Piping the collection
    mockPage = {
      click: jest.fn(),
      keyboard: {
        type: jest.fn()
      }
    } as any as Page

    await forAll()(
      (copyToType, elementSelector) => ([
        click(elementSelector),
        type(copyToType)
      ])
    )(mockPage, {brand:'Pipe', value: keyValuePairs})
    
    expect(mockPage.click).toHaveBeenNthCalledWith(1, 'form input[name="username"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, 'example username')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, 'form input[name="password"]')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, 'example password')
  })

  it('forAll() should recognize null is an object not to iterate', async() => {
    await forAll()(
      (iteratedPiece) => ([
        click(iteratedPiece),
        type(iteratedPiece)
      ])
    )(mockPage, {brand:'Pipe', value: null})
    
    expect(mockPage.click).toHaveBeenCalledTimes(0)
    expect(mockPage.keyboard.type).toHaveBeenCalledTimes(0)
  })

  //
  // doWhile() Unit Test
  it('doWhile() should run the actions then check the condition to run the actions in a loop until the condition rejects or resolves FALSE', async() => {
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))

    // Main test
    let conditionResolvingCount = 0;
    const conditionResolvesTrueUntil3rdResolveAsFalse = async() =>
      new Promise<boolean>(resolve => {
        // let it resolve True twice, then resolve False
        if (conditionResolvingCount > 1) {
          return resolve(false)
        }

        conditionResolvingCount++
        return resolve(true)
      })

    // These actions should run 3 times, then stop
    // 1st time because doWhile always runs the actions at least once without checking the condition
    // 2nd time is the first time the condition resolves True
    // 3rd time is the second time the condition resolves True
    // 4th time is when condition finally resolves False
    await doWhile(conditionResolvesTrueUntil3rdResolveAsFalse)(
      click('1'),
      type('1')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, '1')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, '1')

    expect(mockPage.click).toHaveBeenNthCalledWith(3, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(3, '1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(4, '1')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(4, '1')

    // These actions should run only once
    await doWhile(conditionResolvingFALSE)(
      click('2'),
      type('2')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(4, '2')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(4, '2')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(5, '2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(5, '2')
  })

  it('doWhile() should pass along the correct AbortLineSignal', async() => {
    const conditionResolveFalse:BotAction<boolean> = async() => new Promise(resolve => resolve(false))
    const mockAction = jest.fn(() => Promise.resolve())

    const infinityAbort = await doWhile(conditionResolveFalse)(
      abort(0),
      mockAction
    )(mockPage)

    expect(infinityAbort).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })

    const multipleAbortWithPipeValue = await doWhile(conditionResolveFalse)(
      abort(5, 'pipe-value-test-4'),
      mockAction
    )(mockPage)

    expect(multipleAbortWithPipeValue).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 3,
      pipeValue: 'pipe-value-test-4'
    })

    const singleAbort = await doWhile(conditionResolveFalse)(
      abort(1),
      mockAction
    )(mockPage)

    expect(singleAbort).toBeUndefined()

    expect(mockAction).not.toHaveBeenCalled()

    // setup a test where the abort is during a loop iteration, not initial
    let conditionResolvingCount = 0;
    const conditionResolvesTrue: BotAction<boolean> = async() => new Promise(resolve => resolve(true))
    const multiAbortButMultipleLoops = 
      await doWhile(conditionResolvesTrue)(
        async() => {
          // do nothing the first loop, then abort the 2nd iteration
          if (conditionResolvingCount > 0) {
            return createAbortLineSignal(3)
          } else {
            conditionResolvingCount++
          }
        },
        mockAction
      )(mockPage)

    expect(multiAbortButMultipleLoops).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 1
    })

    expect(mockAction).toHaveBeenCalledTimes(1)

    // abort signal returned by resolving condition tests
    const conditionResolvesAbortOne: BotAction<AbortLineSignal> = async() => createAbortLineSignal()
    const mockActionRunOnce = jest.fn(() => Promise.resolve())
    const conditionAborts = await doWhile(conditionResolvesAbortOne)(
      mockActionRunOnce
    )(mockPage)

    expect(conditionAborts).toBeUndefined()
    expect(mockActionRunOnce).toHaveBeenCalledTimes(1)

    const conditionResolvesAbortInfinite: BotAction<AbortLineSignal> = async() => createAbortLineSignal(0)
    const conditionAbortsInfinity = await doWhile(conditionResolvesAbortInfinite)(
      mockActionRunOnce
    )(mockPage)

    expect(conditionAbortsInfinity).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
    expect(mockActionRunOnce).toHaveBeenCalledTimes(2)

    const conditionResolvesAbortMultiple: BotAction<AbortLineSignal> = async() => createAbortLineSignal(5, 'pipe-value-22')
    const conditionAbortsMultiple = await doWhile(conditionResolvesAbortMultiple)(
      mockActionRunOnce
    )(mockPage)

    expect(conditionAbortsMultiple).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 4,
      pipeValue: 'pipe-value-22'
    })
    expect(mockActionRunOnce).toHaveBeenCalledTimes(3)
  })

  //
  // forAsLong() Unit Test
  it('forAsLong() should check the condition before running the actions in a loop until the condition rejects or resolves FALSE', async() => {
    const conditionResolvingFALSE:BotAction<boolean> = async() => new Promise(resolve => resolve(false))

    // Main test
    let conditionResolvingCount = 0;
    const conditionResolvesTrueUntil3rdResolveAsFalse = async() =>
      new Promise<boolean>(resolve => {
        // let it resolve True twice, then resolve False
        if (conditionResolvingCount > 1) {
          return resolve(false)
        }

        conditionResolvingCount++
        return resolve(true)
      })

    // These actions should run 2 times, then stop
    // 1st time because condition resolves True
    // 2nd time because the condition resolves True
    // 3rd time is when condition finally resolves False
    await forAsLong(conditionResolvesTrueUntil3rdResolveAsFalse)(
      click('1'),
      type('1')
    )(mockPage)

    expect(mockPage.click).toHaveBeenNthCalledWith(1, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, '1')

    expect(mockPage.click).toHaveBeenNthCalledWith(2, '1')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, '1')

    expect(mockPage.click).not.toHaveBeenNthCalledWith(3, '1')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(3, '1')

    // These actions should not run
    await forAsLong(conditionResolvingFALSE)(
      click('2'),
      type('2')
    )(mockPage)

    expect(mockPage.click).not.toHaveBeenNthCalledWith(3, '2')
    expect(mockPage.keyboard.type).not.toHaveBeenNthCalledWith(3, '2')
  })

  it('forAsLong() should pass along the correct AbortLineSignal', async() => {
    const conditionResolvesTrue: BotAction<boolean> = async() => new Promise(resolve => resolve(true))
    const mockAction = jest.fn(() => Promise.resolve())

    const infiniteAbort = await forAsLong(conditionResolvesTrue)(
      abort(0),
      mockAction
    )(mockPage)

    expect(infiniteAbort).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })

    let iterationCount = 0
    const conditionResolvesTrueUntil4thIteration: BotAction<boolean> = async() => new Promise(resolve => {
      if (iterationCount > 2) {
        return resolve(false)
      }

      iterationCount++
      return resolve(true)
    })

    // this breaks the inner assembled loop, but not the loop itself
    const runMockAction = jest.fn(() => Promise.resolve())
    const singleAbort = await forAsLong(conditionResolvesTrueUntil4thIteration)(
      runMockAction,
      abort(),
      mockAction
    )(mockPage)

    expect(singleAbort).toBeUndefined()
    expect(runMockAction).toHaveBeenCalledTimes(3)
    expect(mockAction).not.toHaveBeenCalled()

    //
    const multiAbortWithPipeValue = await forAsLong(conditionResolvesTrue)(
      abort(5, 'pizza'),
      mockAction
    )(mockPage)

    expect(multiAbortWithPipeValue).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 3,
      pipeValue: 'pizza'
    })

    expect(mockAction).not.toHaveBeenCalled()

    // testing abort while deeper in loop iterations
    let iterationCount2 = 0

    const multipleLoopsThenAbort = await forAsLong(conditionResolvesTrue)(
      async() => {
        if (iterationCount2 > 0) {
          return createAbortLineSignal(3, 'some-pipe-value-to-return')
        } else {
          iterationCount2++
        }
      },
      mockAction
    )(mockPage)

    expect(multipleLoopsThenAbort).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 1,
      pipeValue: 'some-pipe-value-to-return'
    })

    expect(mockAction).toHaveBeenCalledTimes(1)

    // testing abort from conditional bot action
    const conditionAbortsInfinity: BotAction<AbortLineSignal> = async() => createAbortLineSignal(0)
    const mockActionNeverRuns = jest.fn(() => Promise.resolve())

    const infiniteConditionAbort = await forAsLong(conditionAbortsInfinity)(
      mockActionNeverRuns
    )(mockPage)

    expect(infiniteConditionAbort).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })

    const conditionAbortsMulti: BotAction<AbortLineSignal> = async() => createAbortLineSignal(5, 'a-pipe-value-to-test-5')

    const multiConditionAbort = await forAsLong(conditionAbortsMulti)(
      mockActionNeverRuns
    )(mockPage)

    expect(multiConditionAbort).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 4,
      pipeValue: 'a-pipe-value-to-test-5'
    })

    const singleConditionAborts: BotAction<AbortLineSignal> = async() => createAbortLineSignal()

    const singleConditionAbortResult = await forAsLong(singleConditionAborts)(
      mockActionNeverRuns
    )(mockPage)

    expect(singleConditionAbortResult).toBeUndefined()

    const singleConditionAbortsWithPipeValue: BotAction<AbortLineSignal> = async() => createAbortLineSignal(1, 'pizza-im-hungry')

    const singleConditionAbortsWithPipeValueResult = await forAsLong(singleConditionAbortsWithPipeValue)(
      mockActionNeverRuns
    )(mockPage)

    expect(singleConditionAbortsWithPipeValueResult).toEqual('pizza-im-hungry')

    // condition aborts after 2nd time, or some time after 1st time (different code handles the subsequent checks)
    let iterationConditionCount = 0
    const mockActionRuns = jest.fn(() => Promise.resolve())
    const conditionAbortsOneOnSecondIteration: BotAction<AbortLineSignal|boolean> = async() => new Promise(resolve => {
      if (iterationConditionCount > 0) {
        return resolve(createAbortLineSignal(1, 'camping'))
      } 
      iterationConditionCount++

      return resolve(true)
    })

    const conditionAbortsOneOnSecondIterationResult = await forAsLong(conditionAbortsOneOnSecondIteration)(
      mockActionRuns
    )(mockPage)

    expect(conditionAbortsOneOnSecondIterationResult).toEqual('camping')
    expect(mockActionRuns).toHaveBeenCalledTimes(1)

    iterationConditionCount = 0

    const conditionAbortsInfiniteOnSecondIteration: BotAction<AbortLineSignal|boolean> = async() => new Promise(resolve => {
      if (iterationConditionCount > 0) {
        return resolve(createAbortLineSignal(0))
      } 
      iterationConditionCount++

      return resolve(true)
    })

    const conditionAbortsInfiniteOnSecondIterationResult = await forAsLong(conditionAbortsInfiniteOnSecondIteration)(
      mockActionRuns
    )(mockPage)

    expect(conditionAbortsInfiniteOnSecondIterationResult).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
    expect(mockActionRuns).toHaveBeenCalledTimes(2)

    iterationConditionCount = 0

    const conditionAbortsMultiOnSecondIteration: BotAction<AbortLineSignal|boolean> = async() => new Promise(resolve => {
      if (iterationConditionCount > 0) {
        return resolve(createAbortLineSignal(8, 'test-value'))
      } 
      iterationConditionCount++

      return resolve(true)
    })

    const conditionAbortsMultiOnSecondIterationResult = await forAsLong(conditionAbortsMultiOnSecondIteration)(
      mockActionRuns
    )(mockPage)

    expect(conditionAbortsMultiOnSecondIterationResult).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 7,
      pipeValue: 'test-value'
    })
    expect(mockActionRuns).toHaveBeenCalledTimes(3)

    // 2 levels necessary to abort from assembled iteration line out of the loop too
    // 1 level from assembled iteration, breaks the assembled line of the iteration but loop continues
    const assembledActionAbortsTwoLinesWithPipeValue = await forAsLong(conditionResolvesTrue)(
      abort(2, 'puppy')
    )(mockPage)

    expect(assembledActionAbortsTwoLinesWithPipeValue).toEqual('puppy')

  })

  //
  // Clean up
  afterAll(() => {
    jest.unmock('botmation/helpers/console')
  })
})
