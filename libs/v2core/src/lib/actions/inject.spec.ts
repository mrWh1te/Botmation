

import { inject, upsertInject } from "./inject"

/**
 * @description   Inject Actions
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
    // in these tests, mockAction1 is the newly created actions line with the upserted inject
    // and mockAction2 is the action used to get the upserted inject's value

    // no injects, with(out) actions to get inject value
    await upsertInject('testKey7')()(mockAction1)()
    expect(mockAction1).toHaveBeenNthCalledWith(1, {'testKey7': undefined})

    await upsertInject('testKey3')(mockAction2)(mockAction1)()
    expect(mockAction1).toHaveBeenNthCalledWith(2, {'testKey3': 'hello world'})
    expect(mockAction2).toHaveBeenNthCalledWith(1, {})

    // empty injects, with(out) actions to get inject value
    await upsertInject('testKey17')()(mockAction1)({})
    expect(mockAction1).toHaveBeenNthCalledWith(3, {'testKey17': undefined})

    await upsertInject('testKey13')(mockAction2)(mockAction1)({})
    expect(mockAction1).toHaveBeenNthCalledWith(4, {'testKey13': 'hello world'})
    expect(mockAction2).toHaveBeenNthCalledWith(2, {})

    // new injects, with(out) actions to get inject value
    await upsertInject('testKey117')()(mockAction1)(newInjects)
    expect(mockAction1).toHaveBeenNthCalledWith(5, {'testKey117': undefined, 'new1': 5, 'new2': 15, 'past3': 45})

    await upsertInject('testKey113')(mockAction2)(mockAction1)(newInjects)
    expect(mockAction1).toHaveBeenNthCalledWith(6, {'testKey113': 'hello world', 'new1': 5, 'new2': 15, 'past3': 45})
    expect(mockAction2).toHaveBeenNthCalledWith(3, {'new1': 5, 'new2': 15, 'past3': 45})

    // new injects overrwrite, with(out) actions to get inject value
    await upsertInject('new2')()(mockAction1)(newInjects)
    expect(mockAction1).toHaveBeenNthCalledWith(7, {'new1': 5, 'new2': undefined, 'past3': 45})

    await upsertInject('new2')(mockAction2)(mockAction1)(newInjects)
    expect(mockAction1).toHaveBeenNthCalledWith(8, {'new1': 5, 'new2': 'hello world', 'past3': 45})
    expect(mockAction2).toHaveBeenNthCalledWith(4, {'new1': 5, 'new2': 15, 'past3': 45})
  })

})
