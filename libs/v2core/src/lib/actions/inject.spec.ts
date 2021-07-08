

import { inject } from "./inject"

/**
 * @description   Inject Action
 */
describe('[Botmation] actions/inject', () => {

  const newInjects = {'new1': 5, 'new2': 15, 'past3': 45}
  const pastInjects = {'past1': 2, 'past2': 23, 'past3': 67}

  let mockAction1, mockAction2
  beforeEach(() => {
    mockAction1 = jest.fn(() => Promise.resolve())
    mockAction2 = jest.fn(() => Promise.resolve('hello world'))
  })

  //
  // Basic Unit Tests
  it('inject()() should set the injects of the inner assembly-line correctly based on new and past injects provided', async () => {
    // empty new injects, no past injects
    await inject({})(mockAction1)()
    // empty new injects, and past injects
    await inject({})(mockAction1)(pastInjects)
    // empty new injects, empty past injects
    await inject({})(mockAction1, mockAction2)({})

    // new injects, but no past injects
    await inject(newInjects)(mockAction1)()
    // new injects, and past injects
    await inject(newInjects)(mockAction1)(pastInjects)
    // new injects, and past empty injects
    await inject(newInjects)(mockAction1, mockAction2)({})

    // 1.
    expect(mockAction1).toHaveBeenNthCalledWith(1, {})
    expect(mockAction1).toHaveBeenNthCalledWith(2, {'past1': 2, 'past2': 23, 'past3': 67})
    expect(mockAction1).toHaveBeenNthCalledWith(3, {})
    expect(mockAction2).toHaveBeenNthCalledWith(1, {})
    expect(mockAction1).toHaveBeenNthCalledWith(4, {'new1': 5, 'new2': 15, 'past3': 45})
    expect(mockAction1).toHaveBeenNthCalledWith(5, {'past1': 2, 'past2': 23, 'past3': 45, 'new1': 5, 'new2': 15})
    expect(mockAction1).toHaveBeenNthCalledWith(6, {'new1': 5, 'new2': 15, 'past3': 45})
    expect(mockAction2).toHaveBeenNthCalledWith(2, {'new1': 5, 'new2': 15, 'past3': 45})
  })

  it('upsertInject()()() should set or replace inject with specified inject key using result of an assembled line of actions in the next line of actions', async() => {

  })

})
