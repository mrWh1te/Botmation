import { Page } from 'puppeteer'
import { chainRunner, pipeRunner, pipeActionOrActions, chain } from 'botmation/actions/assembly-lines'

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
    await chainRunner(
      mockChainAction1, mockChainAction2, mockChainAction3
    )(mockPage, ...mockInjectsNoPipe)

    // no injects
    await chainRunner(
      mockChainAction1, mockChainAction2, mockChainAction3
    )(mockPage)

    expect(mockChainAction1).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockChainAction1).toHaveBeenNthCalledWith(2, {})
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
    await chain(mockAction1, mockAction2, mockAction3)(mockPage, ...mockInjectsNoPipe)

    // 2. injects with pipe, actions
    await chain(mockAction1, mockAction2, mockAction3)(mockPage, ...mockInjectsNoPipe, mockPipe)

    // 3. injects without pipe, 1 action
    await chain(mockAction1)(mockPage, ...mockInjectsNoPipe)

    // 4. injects with pipe, 1 action
    await chain(mockAction1)(mockPage, ...mockInjectsNoPipe, mockPipe)

    // 5. no injects, no actions ?
    await chain()(mockPage)

    expect(mockAction1).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockAction2).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)
    expect(mockAction3).toHaveBeenNthCalledWith(1, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11)
    expect(mockAction2).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11)
    expect(mockAction3).toHaveBeenNthCalledWith(2, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).toHaveBeenNthCalledWith(3, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).toHaveBeenNthCalledWith(4, {}, 2, 3, 5, 7, 11)

    expect(mockAction1).not.toHaveBeenCalledTimes(5)
  })

})
