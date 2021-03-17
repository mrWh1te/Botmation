import { Page } from 'puppeteer'

/**
 * @description   Random BotActions
 */
describe('[Botmation] actions/random', () => {

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
  // rollDice() Unit Tests
  it('rollDice() should roll dice and if the correct number to roll appears, than the assembled actions are ran, otherwise the assembled actions are skipped', async() => {

  })

})
