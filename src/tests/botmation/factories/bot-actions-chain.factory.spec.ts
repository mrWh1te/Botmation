import { Page } from 'puppeteer'

import { enrichGoToPageOptions } from 'botmation/helpers/navigation'
import { click, type } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'
import { BotActionsChain } from 'botmation/factories/bot-actions-chain'

import { BASE_URL, EXAMPLE_URL } from '../../urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '../../selectors'

/**
 * @description   Test the Wrappers (Botmation class and the BotActionsChainFactory)
 *                The factory methods here return BotAction's for the bots to handle more complex use-cases
 */
describe('[Botmation] BotActionsChainFactory', () => {

  beforeEach(async() => {
    await page.goto(BASE_URL, enrichGoToPageOptions())
  })

  //
  // Functional using BotActionsChainFactory
  it('should run the declared actions in sequence on the page provided', async() => {
    await BotActionsChain(page)(
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

    await BotActionsChain(mockPage)(
      (mockPage) => BotActionsChain(mockPage)(
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
    expect(mockPage.goto).toHaveBeenNthCalledWith(1, '1st example url', enrichGoToPageOptions())
    expect(mockPage.click).toHaveBeenNthCalledWith(1, '1st example selector')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(1, '1st example type')
    expect(mockPage.click).toHaveBeenNthCalledWith(2, '2nd example selector')

    // the original chain, continuing
    expect(mockPage.goto).toHaveBeenNthCalledWith(2, '2nd example url', enrichGoToPageOptions())
    expect(mockPage.click).toHaveBeenNthCalledWith(3, '3rd example selector')
    expect(mockPage.keyboard.type).toHaveBeenNthCalledWith(2, '2nd example type')
    expect(mockPage.click).toHaveBeenNthCalledWith(4, '4th example selector')
  })
})
