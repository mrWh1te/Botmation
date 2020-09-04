import { Page } from "puppeteer"

import { pipe, chain } from "botmation/actions/assembly-lines"
import { inject } from "botmation/actions/inject"

import { abort } from 'botmation/actions/abort'
import { createAbortLineSignal } from "botmation/helpers/abort"
import { wrapValueInPipe } from "botmation/helpers/pipe"

/**
 * @description    No module mocking in here
 *                 Test theories ie Stacking BotAction's vertically
 */
describe('[Botmation] Theories', () => {

  let mockPage: Page

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  // unit-testing
  it('inject()() supports nesting and accumulates injects the deeper the Actions are ran', async() => {
    let mockAction0 = jest.fn(() => Promise.resolve())
    let mockAction1 = jest.fn(() => Promise.resolve())
    let mockAction2 = jest.fn(() => Promise.resolve())

    await inject('inject1', 'inject1b', 'inject1c')(
      mockAction0,
      inject('inject2', 'inject2b', 'inject2c')(
        mockAction1,
        inject('inject3', 'inject3b', 'inject3c')(
          mockAction2
        )  
      )
    )(mockPage, 'inject0', 'inject0b', 'inject0c')

    expect(mockAction0).toHaveBeenNthCalledWith(1, {}, 'inject1', 'inject1b', 'inject1c', 'inject0', 'inject0b', 'inject0c')
    expect(mockAction1).toHaveBeenNthCalledWith(1, {}, 'inject2', 'inject2b', 'inject2c', 'inject1', 'inject1b', 'inject1c', 'inject0', 'inject0b', 'inject0c')
    expect(mockAction2).toHaveBeenNthCalledWith(1, {}, 'inject3', 'inject3b', 'inject3c', 'inject2', 'inject2b', 'inject2c', 'inject1', 'inject1b', 'inject1c', 'inject0', 'inject0b', 'inject0c')
  })

  it('aborting is a feature supported infinitely deep with the ability to abort out to a specific level (botaction line)', async() => {
    const mockActionNeverRuns = jest.fn(() => Promise.resolve())

    //
    const infinityAbort = await chain(
      chain(
        chain(
          chain(
            abort(0),
            mockActionNeverRuns
          ),
          mockActionNeverRuns
        ),
        mockActionNeverRuns
      ),
      mockActionNeverRuns
    )(mockPage)

    expect(infinityAbort).toEqual(createAbortLineSignal(0))

    const mockActionRuns1 = jest.fn(() => Promise.resolve())
    const mockActionRuns2 = jest.fn(() => Promise.resolve())
    
    //
    const multiAbort = await chain(
      chain(
        chain(
          chain(
            abort(2),
            mockActionNeverRuns
          ),
          mockActionNeverRuns,
          mockActionRuns1 // doesn't run here
        ),
        mockActionRuns2 // runs
      ),
      mockActionRuns1, // runs
      mockActionRuns2 // runs
    )(mockPage)

    expect(multiAbort).toBeUndefined()
    expect(mockActionNeverRuns).not.toHaveBeenCalled()
    expect(mockActionRuns2).toHaveBeenCalledTimes(2)
    expect(mockActionRuns1).toHaveBeenCalledTimes(1)
    
    //
    const exactMultiFullAbortWithPipeValue = await pipe()(
      pipe()(
        pipe()(
          pipe()(
            pipe()(
              abort(5, 'zoo')
            )
          )
        )
      ),
      mockActionNeverRuns
    )(mockPage)
    expect(exactMultiFullAbortWithPipeValue).toEqual('zoo')
    expect(mockActionNeverRuns).not.toHaveBeenCalled()

    //
    const mockActionRuns = jest.fn((page, pipeObject) => Promise.resolve(pipeObject.value))
    const fewMultiAbortWithPipeValue = await pipe()(
      pipe()(
        pipe()(
          pipe()(
            pipe()(
              pipe()(
                abort(3, 'space'),
                mockActionNeverRuns
              ),
              mockActionNeverRuns
            ),
            mockActionNeverRuns
          ),
          mockActionRuns // similar to log, it will return the pipeValue from the pipe object
        )
      )
    )(mockPage)
    expect(fewMultiAbortWithPipeValue).toEqual('space')
    expect(mockActionNeverRuns).not.toHaveBeenCalled()
    expect(mockActionRuns).toHaveBeenNthCalledWith(1, {}, wrapValueInPipe('space')) // (mockPage, pipeObject)
  })

})