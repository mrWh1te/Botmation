import { inject } from "botmation/actions/inject"
import { Page } from "puppeteer"

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

})