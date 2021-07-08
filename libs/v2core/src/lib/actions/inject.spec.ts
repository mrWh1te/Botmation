

import { inject } from "./inject"

const mockAssemblyLineAction = jest.fn()
jest.mock('./assembly-lines', () => {
  // const originalModule = jest.requireActual('./assembly-lines');

  return {
    // ...originalModule,
    assemblyLine: () => () => mockAssemblyLineAction // notice, only mocking the last function call, where `injects` is set
  }
})

/**
 * @description   Inject BotAction
 */
describe('[Botmation] actions/inject', () => {

  const newInjects = {'new1': 5, 'new2': 15, 'past3': 45}
  const pastInjects = {'past1': 2, 'past2': 23, 'past3': 67}

  let mockAction1, mockAction2

  beforeEach(() => {
    mockAction1 = jest.fn(() => Promise.resolve())
    mockAction2 = jest.fn(() => Promise.resolve())
  })

  //
  // Basic Unit Tests
  it('inject()() should set the injects of the inner assembly-line correctly based on new and past injects provided', async () => {
    // empty new injects, no past injects
    await inject({})()()
    // empty new injects, and past injects
    await inject({})()(pastInjects)
    // empty new injects, empty past injects
    await inject({})()({})

    // new injects, but no past injects
    await inject(newInjects)()()
    // new injects, and past injects
    await inject(newInjects)()(pastInjects)
    // new injects, and past empty injects
    await inject(newInjects)()({})

    // 1.
    expect(mockAssemblyLineAction).toHaveBeenNthCalledWith(1, {})
    expect(mockAssemblyLineAction).toHaveBeenNthCalledWith(2, {'past1': 2, 'past2': 23, 'past3': 67})
    expect(mockAssemblyLineAction).toHaveBeenNthCalledWith(3, {})
    expect(mockAssemblyLineAction).toHaveBeenNthCalledWith(4, {'new1': 5, 'new2': 15, 'past3': 45})
    expect(mockAssemblyLineAction).toHaveBeenNthCalledWith(5, {'past1': 2, 'past2': 23, 'past3': 45, 'new1': 5, 'new2': 15})
    expect(mockAssemblyLineAction).toHaveBeenNthCalledWith(6, {'new1': 5, 'new2': 15, 'past3': 45})
  })

  afterAll(() => {
    // unmock the module for other tests
    jest.unmock('./assembly-lines')
  })

})
