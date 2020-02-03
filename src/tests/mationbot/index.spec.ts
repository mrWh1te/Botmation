import { Page } from 'puppeteer'

import { getDefaultGoToPageOptions } from '@mationbot/helpers/navigation'

import { BASE_URL, EXAMPLE_URL } from '@tests/urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '@tests/selectors'
import { click, type } from '@mationbot/actions/input'
import { goTo } from '@mationbot/actions/navigation'
import { MationBot } from '@mationbot'
import { BotActionsChainFactory } from '@mationbot/factories/bot-actions-chain.factory'

/**
 * @description   Test the Wrappers (MationBot class and the BotActionsChainFactory)
 *                The factory methods here return BotAction's for the bots to handle more complex use-cases
 */
describe('[MationBot:Wrappers] Class & Factory', () => {

  beforeEach(async() => {
    await page.goto(BASE_URL, getDefaultGoToPageOptions())
  })

  //
  // Regular Class Instance
  it('should create a MationBot instance then run the actions', async() => {
    const bot = new MationBot(page)

    await bot.actions(
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR)
    )

    expect(page.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsum')
  })

  //
  // Async Class Instance
  it('should create a MationBot instance using the static asyncConstructor() then run the actions', async() => {
    const bot = await MationBot.asyncConstructor(browser)

    await bot.actions(
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsumloremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR)
    )

    const browserPages = await browser.pages()
    const browerPage = browserPages[0]

    expect(browerPage.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsumloremlipsum')
  })

  //
  // Functional using BotActionsChainFactory
  it('should run the declared actions in sequence on the page provided', async() => {
    await BotActionsChainFactory(page)(
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('functional'),
      click(FORM_SUBMIT_BUTTON_SELECTOR)
    )

    expect(page.url()).toEqual('http://localhost:8080/success.html?answer=functional')
  })

  //
  // Nested Functional Approach Showing How a BotAction can represent another Chain of Actions
  it('should run the nested chain before finishing the rest of the chain', async() => {
    const mockPage = {
      url: jest.fn(() => ''),
      goto: jest.fn(),
      click: jest.fn(),
      keyboard: {
        type: jest.fn()
      }
    } as any as Page

    await BotActionsChainFactory(mockPage)(
      (mockPage) => BotActionsChainFactory(mockPage)(
        goTo('1st example url'),
        click('1st example selector'),
        type('1st example type'),
        click('2nd example selector')
      ),
      goTo('2nd example url'), // the BotActionsChain above must resolve in order, before this gets called
      click('3rd example selector'),
      type('2nd example type'),
      click('4th example selector')
    )

    // Nested chain in original chain (first link in original chain)
    expect(mockPage.goto).toHaveBeenNthCalledWith(1, '1st example url', getDefaultGoToPageOptions())
    expect(mockPage.click).toHaveBeenNthCalledWith(1, '1st example selector')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, '1st example type')
    expect(mockPage.click).toHaveBeenNthCalledWith(2, '2nd example selector')

    // the original chain, continuing
    expect(mockPage.goto).toHaveBeenNthCalledWith(2, '2nd example url', getDefaultGoToPageOptions())
    expect(mockPage.click).toHaveBeenNthCalledWith(3, '3rd example selector')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, '2nd example type')
    expect(mockPage.click).toHaveBeenNthCalledWith(4, '4th example selector')
  })
})
