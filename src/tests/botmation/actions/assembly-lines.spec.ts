import { Page } from 'puppeteer'
import { chainRunner, pipeRunner, pipeActionOrActions, chain, pipe, assemblyLine } from 'botmation/actions/assembly-lines'
import { abort } from 'botmation/actions/abort'
import { AbortLineSignal } from 'botmation/types/abort-signal'
import { createEmptyPipe } from 'botmation/helpers/pipe'

/**
 * @description   Assembly-Lines BotAction's
 *                These actually run BotAction's in chains, pipes, etc
 */
describe('[Botmation] actions/assembly-lines', () => {

  let mockPage: Page

  const mockInjectsNoPipe = [2, 3, 5, 7, 11]
  const mockPipe = {brand: 'Pipe', value: 'mock-pipe-value'}

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  //
  // Unit Tests
  it('chainRunner() should return a BotAction that runs a spread array of BotAction\'s, separatedly', async() => {
    const mockChainAction1 = jest.fn(() => Promise.resolve())
    const mockChainAction2 = jest.fn(() => Promise.resolve())
    const mockChainAction3 = jest.fn(() => Promise.resolve())

    // injects
    const testResult1 = await chainRunner(
      mockChainAction1, mockChainAction2, mockChainAction3
    )(mockPage, ...mockInjectsNoPipe)

    // no injects
    const testResult2 = await chainRunner(
      mockChainAction1, mockChainAction2, mockChainAction3
    )(mockPage)

    expect(mockChainAction1).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockChainAction1).toHaveBeenNthCalledWith(2, {})

    expect(mockChainAction2).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockChainAction2).toHaveBeenNthCalledWith(2, {})

    expect(mockChainAction3).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockChainAction3).toHaveBeenNthCalledWith(2, {})

    expect(testResult1).toBeUndefined()
    expect(testResult2).toBeUndefined()
  })

  it('chainRunner() supports the AbortLineSignal', async() => {
    const mockChainAction1 = jest.fn(() => Promise.resolve())
    const mockChainAction2 = jest.fn(() => Promise.resolve())
    const mockChainAction3 = jest.fn(() => Promise.resolve())

    // Safe default test - abort only 1 line of assembly
    const abortOnlyThisChain = await chainRunner(
      mockChainAction1, mockChainAction2, abort(), mockChainAction3
    )(mockPage)

    // abort multiple # lines of assembly
    const abortMultipleLines = await chainRunner(
      mockChainAction1, mockChainAction2, abort(3), mockChainAction3
    )(mockPage)

    // abort all lines of assembly
    const abortAllLines = await chainRunner(
      mockChainAction1, mockChainAction2, abort(0), mockChainAction3
    )(mockPage)

    expect(mockChainAction1).toHaveBeenNthCalledWith(1, {})
    expect(mockChainAction2).toHaveBeenNthCalledWith(1, {})
    expect(mockChainAction3).not.toHaveBeenCalled()

    expect(mockChainAction1).toHaveBeenNthCalledWith(2, {})
    expect(mockChainAction2).toHaveBeenNthCalledWith(2, {})
    expect(mockChainAction3).not.toHaveBeenCalled()

    expect(mockChainAction1).toHaveBeenNthCalledWith(3, {})
    expect(mockChainAction2).toHaveBeenNthCalledWith(3, {})
    expect(mockChainAction3).not.toHaveBeenCalled()

    expect(abortOnlyThisChain).toBeUndefined() 
    expect(abortMultipleLines).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 2 // 1 less
    })
    expect(abortAllLines).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
  })

  it('pipeRunner() should return a BotAction that runs a spread array of BotAction\'s, separated with Piping', async() => {
    const mockPipeAction1 = jest.fn(() => Promise.resolve())
    const mockPipeAction2 = jest.fn(() => Promise.resolve('hello'))
    const mockPipeAction3 = jest.fn(() => Promise.resolve('world'))

    // injects, mockPipeAction3 at end (return 'world')
    const pipeRunnerResult = await pipeRunner(
      mockPipeAction1, mockPipeAction2, mockPipeAction3
    )(mockPage, ...mockInjectsNoPipe)

    expect(mockPipeAction1).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: undefined})
    expect(mockPipeAction2).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: undefined})
    expect(mockPipeAction3).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'hello'})
    expect(pipeRunnerResult).toEqual('world')

    // no injects, mockPipeAction1 at end (return undefined)
    const pipeRunnerResult2 = await pipeRunner(
      mockPipeAction2, mockPipeAction3, mockPipeAction1
    )(mockPage)

    expect(mockPipeAction2).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe', value: undefined})
    expect(mockPipeAction3).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe', value: 'hello'})
    expect(mockPipeAction1).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe', value: 'world'})
    expect(pipeRunnerResult2).toBeUndefined()
  })

  it('pipeRunner() supports the AbortLineSignal', async() => {
    const mockPipeAction1 = jest.fn(() => Promise.resolve())
    const mockPipeAction2 = jest.fn(() => Promise.resolve())
    const mockPipeAction3 = jest.fn(() => Promise.resolve())

    // Safe default test - abort only 1 line of assembly
    const abortOnlyThisLine = await pipeRunner(
      mockPipeAction1, mockPipeAction2, abort(), mockPipeAction3
    )(mockPage)

    // abort multiple # lines of assembly
    const abortMultipleLines = await pipeRunner(
      mockPipeAction1, mockPipeAction2, abort(7), mockPipeAction3
    )(mockPage)

    // abort all lines of assembly
    const abortAllLines = await pipeRunner(
      mockPipeAction1, mockPipeAction2, abort(0), mockPipeAction3
    )(mockPage)

    // when a pipe line is aborted with AbortLineSignal, the signal's `pipeValue` property will set the return value
    // if unused, the value `undefined` is returned
    const abortOnlyThisLineWithPipeValue = await pipeRunner(
      mockPipeAction1, mockPipeAction2, abort(1, 'this got aborted'), mockPipeAction3
    )(mockPage)

    const emptyPipeObject = createEmptyPipe()
    expect(mockPipeAction1).toHaveBeenNthCalledWith(1, {}, emptyPipeObject)
    expect(mockPipeAction2).toHaveBeenNthCalledWith(1, {}, emptyPipeObject)
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(mockPipeAction1).toHaveBeenNthCalledWith(2, {}, emptyPipeObject)
    expect(mockPipeAction2).toHaveBeenNthCalledWith(2, {}, emptyPipeObject)
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(mockPipeAction1).toHaveBeenNthCalledWith(3, {}, emptyPipeObject)
    expect(mockPipeAction2).toHaveBeenNthCalledWith(3, {}, emptyPipeObject)
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(mockPipeAction1).toHaveBeenNthCalledWith(4, {}, emptyPipeObject)
    expect(mockPipeAction2).toHaveBeenNthCalledWith(4, {}, emptyPipeObject)
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(abortOnlyThisLine).toBeUndefined() // no pipeValue provided, so return value is `undefined`
    expect(abortMultipleLines).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 6 // 1 less
    })
    expect(abortAllLines).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
    expect(abortOnlyThisLineWithPipeValue).toEqual('this got aborted')
    
    // funky test
    const mockPipeAction = jest.fn(() => Promise.resolve('947'))

    const funkyTest = await pipeRunner(
      () => Promise.resolve('may the funk me with you' as any as AbortLineSignal),
      mockPipeAction
    )(mockPage)

    expect(funkyTest).toEqual('947')
  })

  it('pipeActionOrActions() should run the given action or actions efficiently in a pipe', async() => {
    const mockAction = jest.fn(() => Promise.resolve('hi'))

    const mockActions1 = jest.fn(() => Promise.resolve('hello'))
    const mockActions2 = jest.fn(() => Promise.resolve('earth'))
    const mockActions3 = jest.fn(() => Promise.resolve('we come in peace'))

    // no injects, 1 action
    const testResult1 = await pipeActionOrActions(
      mockAction
    )(mockPage)

    expect(testResult1).toEqual('hi')

    // no injects, 1 action as actions
    const testResult2 = await pipeActionOrActions(
      [mockAction]
    )(mockPage)

    expect(testResult2).toEqual('hi')

    // injects, 1 action
    const testResult3 = await pipeActionOrActions(
      mockAction
    )(mockPage, ...mockInjectsNoPipe)

    expect(testResult3).toEqual('hi')

    // injects, 1 action as actions
    const testResult4 = await pipeActionOrActions(
      [mockAction]
    )(mockPage, ...mockInjectsNoPipe)

    expect(testResult4).toEqual('hi')

    // no injects, multiple actions
    const testResult5 = await pipeActionOrActions(
      [mockActions1, mockActions2, mockActions3]
    )(mockPage)

    expect(testResult5).toEqual('we come in peace')

    // injects, multiple actions
    const testResult6 = await pipeActionOrActions(
      [mockActions1, mockActions2, mockActions3]
    )(mockPage, ...mockInjectsNoPipe)

    expect(testResult6).toEqual('we come in peace')

    // pipe, no injects, 1 action
    const testResult7 = await pipeActionOrActions(
      mockAction
    )(mockPage, {brand: 'Pipe', value: 1337})

    expect(testResult7).toEqual('hi')

    // pipe, injects, 1 action
    const testResult8 = await pipeActionOrActions(
      mockAction
    )(mockPage, ...mockInjectsNoPipe, {brand: 'Pipe', value: 1337})

    expect(testResult8).toEqual('hi')

    // pipe, injects, action as multiple actions
    const testResult9 = await pipeActionOrActions(
      [mockAction]
    )(mockPage, ...mockInjectsNoPipe, {brand: 'Pipe', value: 1337})

    expect(testResult9).toEqual('hi')

    expect(mockAction).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: undefined})
    expect(mockAction).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe', value: undefined})
    expect(mockAction).toHaveBeenNthCalledWith(3, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: undefined})
    expect(mockAction).toHaveBeenNthCalledWith(4, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: undefined})

    expect(mockActions1).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: undefined})
    expect(mockActions2).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: 'hello'})
    expect(mockActions3).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: 'earth'})

    expect(mockActions1).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: undefined})
    expect(mockActions2).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'hello'})
    expect(mockActions3).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'earth'})

    expect(mockAction).toHaveBeenNthCalledWith(5, {}, {brand: 'Pipe', value: 1337})
    expect(mockAction).toHaveBeenNthCalledWith(6, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 1337})
    expect(mockAction).toHaveBeenNthCalledWith(7, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 1337})
  })

  it('chain() should run the given actions efficiently in a chain, so if the injects coming in has a Pipe, this will strip it', async() => {
    const mockAction1 = jest.fn(() => Promise.resolve())
    const mockAction2 = jest.fn(() => Promise.resolve())
    const mockAction3 = jest.fn(() => Promise.resolve())

    // 1. injects without pipe, actions
    const testResult1 = await chain(mockAction1, mockAction2, mockAction3)(mockPage, ...mockInjectsNoPipe)

    // 2. injects with pipe, actions
    const testResult2 = await chain(mockAction1, mockAction2, mockAction3)(mockPage, ...mockInjectsNoPipe, mockPipe)

    // 3. injects without pipe, 1 action
    const testResult3 = await chain(mockAction1)(mockPage, ...mockInjectsNoPipe)

    // 4. injects with pipe, 1 action
    const testResult4 = await chain(mockAction1)(mockPage, ...mockInjectsNoPipe, mockPipe)

    // 5. no injects, no actions ?
    const testResult5 = await chain()(mockPage)

    // 6. injects, pipe, no actions
    await expect(chain()(mockPage, ...mockInjectsNoPipe, mockPipe)).resolves.toBeUndefined() // missing edge-case

    expect(mockAction1).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockAction2).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockAction3).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11)
    expect(mockAction2).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11)
    expect(mockAction3).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).toHaveBeenNthCalledWith(3, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).toHaveBeenNthCalledWith(4, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).not.toHaveBeenCalledTimes(5)

    // Constrain chain's to ultimately resolve as undefined, since their last async function will not return a value, other than undefined
    expect(testResult1).toBeUndefined()
    expect(testResult2).toBeUndefined()
    expect(testResult3).toBeUndefined()
    expect(testResult4).toBeUndefined()
    expect(testResult5).toBeUndefined()
  })

  it('chain() should support the AbortLineSignal', async() => {
    //
    // multiple actions - no pipe
    const mockChainAction1 = jest.fn(() => Promise.resolve())
    const mockChainAction2 = jest.fn(() => Promise.resolve())
    const mockChainAction3 = jest.fn(() => Promise.resolve())

    // Safe default test - abort only 1 line of assembly
    const abortOnlyThisChain = await chain(
      mockChainAction1, mockChainAction2, abort(), mockChainAction3
    )(mockPage)

    // abort multiple # lines of assembly
    const abortMultipleLines = await chain(
      mockChainAction1, mockChainAction2, abort(3), mockChainAction3
    )(mockPage)

    // abort all lines of assembly
    const abortAllLines = await chain(
      mockChainAction1, mockChainAction2, abort(0), mockChainAction3
    )(mockPage)

    expect(mockChainAction1).toHaveBeenNthCalledWith(1, {})
    expect(mockChainAction2).toHaveBeenNthCalledWith(1, {})
    expect(mockChainAction3).not.toHaveBeenCalled()

    expect(mockChainAction1).toHaveBeenNthCalledWith(2, {})
    expect(mockChainAction2).toHaveBeenNthCalledWith(2, {})
    expect(mockChainAction3).not.toHaveBeenCalled()

    expect(mockChainAction1).toHaveBeenNthCalledWith(3, {})
    expect(mockChainAction2).toHaveBeenNthCalledWith(3, {})
    expect(mockChainAction3).not.toHaveBeenCalled()

    expect(abortOnlyThisChain).toBeUndefined() 
    expect(abortMultipleLines).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 2 // 1 less
    })
    expect(abortAllLines).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })

    //
    // one action
    const oneActionMultipleAborts = await chain(
      abort(27)
    )(mockPage)
    expect(oneActionMultipleAborts).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 26
    })

    const oneActionOneAbort = await chain(
      abort()
    )(mockPage)
    expect(oneActionOneAbort).toBeUndefined()

    const oneActionInfiniteAborts = await chain(
      abort(0)
    )(mockPage)
    expect(oneActionInfiniteAborts).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })

    const funkyTest1 = await chain(
      () => Promise.resolve('some-value' as any as AbortLineSignal)
    )(mockPage)

    expect(funkyTest1).toBeUndefined()

    //
    // multiple actions - with pipe
    const mockTestPreventedAction2 = jest.fn(() => Promise.resolve())

    const multipleActionMultileAbortsWithPipe = await chain(
      abort(27), mockTestPreventedAction2
    )(mockPage, {brand: 'Pipe', value: 'multiple actions test with abort'})

    expect(multipleActionMultileAbortsWithPipe).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 26
    })
    expect(mockTestPreventedAction2).not.toHaveBeenCalled()

    const multipleActionInfiniteAbortsWithPipe = await chain(
      abort(0), mockTestPreventedAction2
    )(mockPage, {brand: 'Pipe', value: 'multiple actions test with abort'})

    expect(multipleActionInfiniteAbortsWithPipe).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
    expect(mockTestPreventedAction2).not.toHaveBeenCalled()

    const multipleActionOneAbortWithPipe = await chain(
      abort(), mockTestPreventedAction2
    )(mockPage, {brand: 'Pipe', value: 'multiple actions test with abort'})

    expect(multipleActionOneAbortWithPipe).toBeUndefined()
    expect(mockTestPreventedAction2).not.toHaveBeenCalled()

    //
    // one action - with pipe
    const mockTestPreventedAction = jest.fn(() => Promise.resolve())

    const oneActionMultileAborts = await chain(
      abort(27)
    )(mockPage, {brand: 'Pipe', value: 'test'})

    expect(oneActionMultileAborts).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 26
    })
    expect(mockTestPreventedAction).not.toHaveBeenCalled()

    const oneActionInfiniteAbortWithPipe = await chain(
      abort(0)
    )(mockPage, {brand: 'Pipe', value: 'test'})

    expect(oneActionInfiniteAbortWithPipe).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
    expect(mockTestPreventedAction).not.toHaveBeenCalled()

    const oneActionOneAbortWithPipe = await chain(
      abort()
    )(mockPage, {brand: 'Pipe', value: 'test'})

    expect(oneActionOneAbortWithPipe).toBeUndefined()

    const funkyTest2 = await chain(
      () => Promise.resolve('some-value' as any as AbortLineSignal)
    )(mockPage, {brand: 'Pipe', value: 'test'})

    expect(funkyTest2).toBeUndefined()
  })

  it('pipe() should run given actions efficiently in a pipe (values returned are Piped into subsequent actions), provide an empty Pipe, if the injects coming in do not have a Pipe and overwrite the initial past in Pipe value if given a value to pipe()', async() => {
    const mockAction1 = jest.fn(() => Promise.resolve('apples'))
    const mockAction2 = jest.fn(() => Promise.resolve('bananas'))
    const mockAction3 = jest.fn(() => Promise.resolve('spinach'))

    const valueToPipe = 'a-value-to-be-piped'

    // 1. pipe, no actions
    const testResult1 = await pipe()()(mockPage, {brand: 'Pipe'})
    expect(testResult1).toBeUndefined()

    // 2. pipe, 1 action, value to pipe
    const testResult2 = await pipe(valueToPipe)(mockAction1)(mockPage, {brand: 'Pipe'})
    expect(testResult2).toEqual('apples')
    expect(mockAction1).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: 'a-value-to-be-piped'})

    // 3. pipe, 1 action, no value to pipe
    const testResult3 = await pipe()(mockAction1)(mockPage, {brand: 'Pipe', value: 'oranges'})
    expect(testResult3).toEqual('apples')
    expect(mockAction1).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe', value: 'oranges'})

    // 4. pipe, actions, value to pipe
    const testResult4 = await pipe(valueToPipe)(mockAction1, mockAction2, mockAction3)(mockPage, {brand: 'Pipe', value: 'oranges'})
    expect(testResult4).toEqual('spinach')
    expect(mockAction1).toHaveBeenNthCalledWith(3, {}, {brand: 'Pipe', value: 'a-value-to-be-piped'})
    expect(mockAction2).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: 'apples'})
    expect(mockAction3).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe', value: 'bananas'})

    // 5. pipe, actions, no value to pipe
    const testResult5 = await pipe()(mockAction1, mockAction2, mockAction3)(mockPage, {brand: 'Pipe', value: 'oranges'})
    expect(testResult5).toEqual('spinach')
    expect(mockAction1).toHaveBeenNthCalledWith(4, {}, {brand: 'Pipe', value: 'oranges'})
    expect(mockAction2).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe', value: 'apples'})
    expect(mockAction3).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe', value: 'bananas'})

    // 6. no pipe, no actions
    const testResult6 = await pipe()()(mockPage)
    expect(testResult6).toBeUndefined()

    // 7. no pipe, 1 action, value to pipe
    const testResult7 = await pipe(valueToPipe)(mockAction1)(mockPage)
    expect(testResult7).toEqual('apples')
    expect(mockAction1).toHaveBeenNthCalledWith(5, {}, {brand: 'Pipe', value: 'a-value-to-be-piped'})

    // 8. no pipe, 1 action, no value to pipe
    const testResult8 = await pipe()(mockAction1)(mockPage)
    expect(testResult8).toEqual('apples')
    expect(mockAction1).toHaveBeenNthCalledWith(6, {}, {brand: 'Pipe', value: undefined})

    // 9. no pipe, actions, value to pipe
    const testResult9 = await pipe(valueToPipe)(mockAction1, mockAction2, mockAction3)(mockPage)
    expect(testResult9).toEqual('spinach')
    expect(mockAction1).toHaveBeenNthCalledWith(7, {}, {brand: 'Pipe', value: 'a-value-to-be-piped'})
    expect(mockAction2).toHaveBeenNthCalledWith(3, {}, {brand: 'Pipe', value: 'apples'})
    expect(mockAction3).toHaveBeenNthCalledWith(3, {}, {brand: 'Pipe', value: 'bananas'})

    // 10. no pipe, actions, no value to pipe
    const testResult10 = await pipe()(mockAction1, mockAction2, mockAction3)(mockPage)
    expect(testResult10).toEqual('spinach')
    expect(mockAction1).toHaveBeenNthCalledWith(8, {}, {brand: 'Pipe', value: undefined})
    expect(mockAction2).toHaveBeenNthCalledWith(4, {}, {brand: 'Pipe', value: 'apples'})
    expect(mockAction3).toHaveBeenNthCalledWith(4, {}, {brand: 'Pipe', value: 'bananas'})

    // 11. pipe, 1 action, value to pipe, injects
    const testResult11 = await pipe(valueToPipe)(mockAction1)(mockPage, 1, 3, 3, 7, {brand: 'Pipe', value: 'oranges'})
    expect(testResult11).toEqual('apples')
    expect(mockAction1).toHaveBeenNthCalledWith(9, {}, 1, 3, 3, 7, {brand: 'Pipe', value: 'a-value-to-be-piped'})

    // 12. pipe, actions, value to pipe, injects
    const testResult12 = await pipe(valueToPipe)(mockAction1, mockAction2, mockAction3)(mockPage, 1, 3, 3, 7, {brand: 'Pipe', value: 'oranges'})
    expect(testResult12).toEqual('spinach')
    expect(mockAction1).toHaveBeenNthCalledWith(10, {}, 1, 3, 3, 7, {brand: 'Pipe', value: 'a-value-to-be-piped'})
    expect(mockAction2).toHaveBeenNthCalledWith(5, {}, 1, 3, 3, 7, {brand: 'Pipe', value: 'apples'})
    expect(mockAction3).toHaveBeenNthCalledWith(5, {}, 1, 3, 3, 7, {brand: 'Pipe', value: 'bananas'})
  })

  it('pipe() supports the AbortLineSignal', async() => {
    //
    // one action, no higher-order pipe
    const oneActionAbort1LineNoPipeValue = await pipe()(
      abort(1)
    )(mockPage)
    const oneActionAbort1LinePipeValue = await pipe()(
      abort(1, 'pipe-value-1')
    )(mockPage)

    const infiniteAbort1Action = await pipe()(
      abort(0)
    )(mockPage)

    const multipleAborts1Action = await pipe()(
      abort(5)
    )(mockPage)

    expect(oneActionAbort1LineNoPipeValue).toEqual(undefined)
    expect(oneActionAbort1LinePipeValue).toEqual('pipe-value-1')

    expect(infiniteAbort1Action).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })
    expect(multipleAborts1Action).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 4
    })

    //
    // one action, with higher-order pipe via injects
    const emptyPipeObject = createEmptyPipe()
    const oneActionAbort1LineWithHigherOrderPipe = await pipe()(
      abort()
    )(mockPage, emptyPipeObject)
    const oneActionAbort1LineWithHigherOrderPipeWithPipeValue = await pipe()(
      abort(1, 'pipe-value-10')
    )(mockPage, emptyPipeObject)

    const oneActionAbortInfinite = await pipe()(
      abort(0)
    )(mockPage, emptyPipeObject)

    const oneActionMultipleAbort = await pipe()(
      abort(5)
    )(mockPage, emptyPipeObject)

    expect(oneActionAbort1LineWithHigherOrderPipe).toBeUndefined()
    expect(oneActionAbort1LineWithHigherOrderPipeWithPipeValue).toEqual('pipe-value-10')

    expect(oneActionAbortInfinite).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0
    })

    expect(oneActionMultipleAbort).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 4
    })

    //
    // multiple actions, no higher-order pipe
    const mockPipeAction1 = jest.fn(() => Promise.resolve())
    const mockPipeAction2 = jest.fn(() => Promise.resolve())
    const mockPipeAction3 = jest.fn(() => Promise.resolve())

    const multipleActionsThenAbortNoPipeValue = await pipe()(
      mockPipeAction1, mockPipeAction2, abort(), mockPipeAction3
    )(mockPage)

    expect(mockPipeAction1).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe'})
    expect(mockPipeAction2).toHaveBeenNthCalledWith(1, {}, {brand: 'Pipe'})
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(multipleActionsThenAbortNoPipeValue).toBeUndefined()

    const multipleActionsThenAbortWithPipeValue = await pipe()(
      mockPipeAction1, mockPipeAction2, abort(1, 'pipe-value-2'), mockPipeAction3
    )(mockPage)

    expect(mockPipeAction1).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe'})
    expect(mockPipeAction2).toHaveBeenNthCalledWith(2, {}, {brand: 'Pipe'})
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(multipleActionsThenAbortWithPipeValue).toEqual('pipe-value-2')

    const multipleActionsInfiniteAbortWithPipeValue = await pipe()(
      mockPipeAction1, mockPipeAction2, abort(0, 'pipe-value-3'), mockPipeAction3
    )(mockPage)

    expect(mockPipeAction1).toHaveBeenNthCalledWith(3, {}, {brand: 'Pipe'})
    expect(mockPipeAction2).toHaveBeenNthCalledWith(3, {}, {brand: 'Pipe'})
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(multipleActionsInfiniteAbortWithPipeValue).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 0,
      pipeValue: 'pipe-value-3'
    })

    const multipleActionsMultipleAbortsWithPipeValue = await pipe()(
      mockPipeAction1, mockPipeAction2, abort(5, 'pipe-value-3'), mockPipeAction3
    )(mockPage)

    expect(mockPipeAction1).toHaveBeenNthCalledWith(4, {}, {brand: 'Pipe'})
    expect(mockPipeAction2).toHaveBeenNthCalledWith(4, {}, {brand: 'Pipe'})
    expect(mockPipeAction3).not.toHaveBeenCalled()

    expect(multipleActionsMultipleAbortsWithPipeValue).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 4,
      pipeValue: 'pipe-value-3'
    })

  })

  it('assemblyLine() should efficiently run the actions provided in a returned pipe or non-returned chain, depending if the injects coming in have a Pipe or not with the exception of the higher order forceInPipe flag set to TRUE', async() => {
    const mockAction1 = jest.fn(() => Promise.resolve('mars'))
    const mockAction2 = jest.fn(() => Promise.resolve('saturn'))
    const mockAction3 = jest.fn(() => Promise.resolve('pluto'))

    // 1-6 returns values

    // 1. pipe, no actions, injects
    const testResult1 = await assemblyLine()()(mockPage, ...mockInjectsNoPipe, mockPipe)
    expect(testResult1).toBeUndefined()

    // 2. no pipe, force in pipe, no actions, injects
    const testResult2 = await assemblyLine(true)()(mockPage, ...mockInjectsNoPipe)
    expect(testResult2).toBeUndefined()

    // 3. pipe, 1 action, injects
    const testResult3 = await assemblyLine()(mockAction1)(mockPage, ...mockInjectsNoPipe, mockPipe)
    expect(testResult3).toEqual('mars')
    expect(mockAction1).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'mock-pipe-value'})

    // 4. no pipe, force in pipe, 1 action, injects
    const testResult4 = await assemblyLine(true)(mockAction1)(mockPage, ...mockInjectsNoPipe)
    expect(testResult4).toEqual('mars')
    expect(mockAction1).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: undefined})

    // 5. pipe, actions, injects
    const testResult5 = await assemblyLine()(mockAction1, mockAction2, mockAction3)(mockPage, ...mockInjectsNoPipe, mockPipe)
    expect(testResult5).toEqual('pluto')
    expect(mockAction1).toHaveBeenNthCalledWith(3, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'mock-pipe-value'})
    expect(mockAction2).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'mars'})
    expect(mockAction3).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'saturn'})

    // 6. no pipe, force in pipe, actions, injects
    const testResult6 = await assemblyLine(true)(mockAction1, mockAction2, mockAction3)(mockPage, ...mockInjectsNoPipe)
    expect(testResult6).toEqual('pluto')
    expect(mockAction1).toHaveBeenNthCalledWith(4, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: undefined})
    expect(mockAction2).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'mars'})
    expect(mockAction3).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11, {brand: 'Pipe', value: 'saturn'})

    // 7-9 do no return values, but await returns undefined in a Promise that resolves no value

    // 7. no pipe (chain), no actions, injects
    const testResult7 = await assemblyLine()()(mockPage, ...mockInjectsNoPipe)
    expect(testResult7).toBeUndefined()

    // 8. no pipe (chain), 1 action, injects
    const testResult8 = await assemblyLine()(mockAction1)(mockPage, ...mockInjectsNoPipe)
    expect(testResult8).toBeUndefined()
    expect(mockAction1).toHaveBeenNthCalledWith(5, {}, 2, 3, 5, 7, 11)

    // 9. no pipe (chain), actions, injects
    const testResult9 = await assemblyLine()(mockAction1, mockAction2, mockAction3)(mockPage, ...mockInjectsNoPipe)
    expect(testResult9).toBeUndefined()
    expect(mockAction1).toHaveBeenNthCalledWith(6, {}, 2, 3, 5, 7, 11)
    expect(mockAction2).toHaveBeenNthCalledWith(3, {}, 2, 3, 5, 7, 11)
    expect(mockAction3).toHaveBeenNthCalledWith(3, {}, 2, 3, 5, 7, 11)
  })

})
