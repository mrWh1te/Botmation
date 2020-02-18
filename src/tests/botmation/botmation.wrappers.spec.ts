import { Page, Browser } from 'puppeteer'

import { getDefaultGoToPageOptions } from 'botmation/helpers/navigation'
import { click, type } from 'botmation/actions/input'
import { goTo } from 'botmation/actions/navigation'
import { Botmation } from 'botmation/class'
import { BotActionsChainFactory } from 'botmation/factories/bot-actions-chain.factory'

import { BASE_URL, EXAMPLE_URL } from '../urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '../selectors'

/**
 * @description   Test the Wrappers (Botmation class and the BotActionsChainFactory)
 *                The factory methods here return BotAction's for the bots to handle more complex use-cases
 */
describe('[Botmation:Wrappers] Class & Factory', () => {

  beforeEach(async() => {
    await page.goto(BASE_URL, getDefaultGoToPageOptions())
  })

  //
  // Regular Class Instance
  it('should create a Botmation instance then run the actions', async() => {
    const bot = new Botmation(page)

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
  it('should create a Botmation instance using the static asyncConstructor() then run the actions', async() => {
    const bot = await Botmation.asyncConstructor(browser)

    await bot.actions(
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsumloremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR)
    )

    const page = bot.getPage()
    expect(page.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsumloremlipsum')
  })
  it('should create a Botmation instance using the static asyncConstructor() and create a new page when the browser has none automatically', async() => {
    /// this mocked use-case is for when the browser provided has no tabs open
    const mockPage = {
      click: jest.fn()
    } as any as Page
    const mockPages = [] as any // no pages 
    // the async constructor method's purpose is to get the page (tab) from the browser
    // so if none, it needs to create it, then use it
    const mockBrowser = {
      pages: jest.fn(() => mockPages),
      newPage: jest.fn(() => mockPage)
    } as any as Browser
    
    const bot = await Botmation.asyncConstructor(mockBrowser)

    await bot.actions(
      click('example html selector')
    )

    expect(mockBrowser.pages).toHaveBeenCalled()
    expect(mockBrowser.newPage).toHaveBeenCalled()
    expect(mockPage.click).toHaveBeenCalledWith('example html selector')
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
