

import { inject } from "./inject"
import { Page } from "puppeteer"

// Mock the Assembly-Lines Module so when injects() imports it
// we can test how inject() calls the exported assemblyLine higher order function
// particularly, interested in the inner 3rd call, the actual BotAction to determine
// if or not we have properly set up the injects based on the provided injects, both past and new
const mockAssemblyLineBotAction = jest.fn()
jest.mock('./assembly-lines', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('./assembly-lines');

  return {
    ...originalModule,
    assemblyLine: () => () => mockAssemblyLineBotAction // notice, only mocking the last function call, where `injects` is set
  }
})

/**
 * @description   Inject BotAction
 */
describe('[Botmation] actions/inject', () => {

  const newInjects = ['new1', 'new2']
  const pastInjects = ['past1', 'past2', 'past3']

  let mockPage: Page

  beforeEach(() => {
    mockPage = {} as any as Page
  })

  //
  // Basic Unit Tests
  it('inject()() should set the injects of the inner assembly-line correctly based on new and past injects provided', async () => {
    // no injects
    await inject()()(mockPage)

    // new injects, but no past injects
    await inject(...newInjects)()(mockPage)

    // new injects, and past injects
    await inject(...newInjects)()(mockPage, ...pastInjects)

    expect(mockAssemblyLineBotAction).toHaveBeenNthCalledWith(1, {})
    expect(mockAssemblyLineBotAction).toHaveBeenNthCalledWith(2, {}, 'new1', 'new2')
    expect(mockAssemblyLineBotAction).toHaveBeenNthCalledWith(3, {}, 'new1', 'new2', 'past1', 'past2', 'past3')
  })

  afterAll(() => {
    // unmock the module for other tests
    jest.unmock('./assembly-lines')
  })

})
