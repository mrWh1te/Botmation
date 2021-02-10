

import { Page } from "puppeteer"
import { errors } from "@botmation/core"

jest.mock('../helpers/console', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../helpers/console')

  return {
    // __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    logError: jest.fn()
  }
})

/**
 * @description   Errors BotAction
 */
describe('[Botmation] actions/errors', () => {

  let consoleErrorLog: any[] = []
  const originalConsoleLog = console.log
  const originalConsoleError = console.error

  beforeAll(() => {
    console.log = jest.fn()
    console.error = jest.fn(args => {
      consoleErrorLog.push(args)
    })
  })

  beforeEach(() => {
    consoleErrorLog = []
  })

  let mockPage = {} as any as Page

  //
  // Basic Unit Tests
  it('errors() runs actions provided either in a chain or a pipe (returns pipe value, if runs in a pipe) and catches an error thrown which prevents further actions from running', async () => {
    // @future if needed, errors() can be expanded to run its own action runners so that each action can be individually wrapped in try/catch
    //         in order to let remaining actions still run...
    const mock3rdAction = jest.fn(() => Promise.resolve())
    const {logError: mockLogError} = require('../helpers/console')

    // basic example with errors block name set, no injects, no Pipe, so ran in chain
    await errors('errors-block-1')(
      async() => {
        // placeholder action, let's catch an error from the 2nd
      },
      async() => {
        throw new Error('errors-block-1-2nd-action-error')
      },
      mock3rdAction
    )(mockPage)

    expect(mockLogError).toHaveBeenNthCalledWith(1, 'caught in errors-block-1')
    expect(consoleErrorLog[0].toString()).toEqual('Error: errors-block-1-2nd-action-error')
    expect(console.log).toHaveBeenNthCalledWith(1, '\n') // spacer to distinguish this error block from next log
    expect(mock3rdAction).not.toHaveBeenCalled()

    // try injects but without Pipe, still chain
    await errors('errors-block-2')(
      async() => {},
      async() => { throw new Error('errors-block-2-2nd-action-error') },
      mock3rdAction
    )(mockPage, 5, 'hi', 'dog')

    expect(mockLogError).toHaveBeenNthCalledWith(2, 'caught in errors-block-2')
    expect(consoleErrorLog[1].toString()).toEqual('Error: errors-block-2-2nd-action-error')
    expect(console.log).toHaveBeenNthCalledWith(2, '\n') // spacer to distinguish this error block from next log
    expect(mock3rdAction).not.toHaveBeenCalled()

    // try injects with Pipe, ran in pipe()()()
    await errors('errors-block-3')(
      async() => {},
      async() => { throw new Error('errors-block-3-2nd-action-error') },
      mock3rdAction
    )(mockPage, 5, 'hi', 'dog', {brand: 'Pipe', value: 42})

    expect(mockLogError).toHaveBeenNthCalledWith(3, 'caught in errors-block-3')
    expect(consoleErrorLog[2].toString()).toEqual('Error: errors-block-3-2nd-action-error')
    expect(console.log).toHaveBeenNthCalledWith(3, '\n') // spacer to distinguish this error block from next log
    expect(mock3rdAction).not.toHaveBeenCalled()

    // test return's pipe()()() value, when no error
    const errorsPipeReturnValue = await errors('errors-block-4')(
      async() => {},
      async() => 521
    )(mockPage, {brand: 'Pipe'})

    expect(errorsPipeReturnValue).toEqual(521)

    // safety fallback for no error block name provided
    await errors()(
      async() => { throw new Error('anon error, where did we come from?') }
    )(mockPage)

    expect(mockLogError).toHaveBeenNthCalledWith(4, 'caught in Unnamed Errors Block')
  })

  afterAll(() => {
    // unmock the module for other tests
    jest.unmock('../helpers/console')
    console.log = originalConsoleLog
    console.error = originalConsoleError
  })

})
