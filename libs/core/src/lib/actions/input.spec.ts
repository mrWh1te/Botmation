import { Page, Browser } from 'puppeteer'

import { click, clickText, type } from './input'

import { FORM_SUBMIT_BUTTON_SELECTOR, FORM_TEXT_INPUT_SELECTOR, BASE_URL } from './../mocks'

const puppeteer = require('puppeteer');

/**
 * @description   Input BotAction's
 *                The factory methods here return BotAction's for the bots to input into the page as User
 *                  ie mouse click, keyboard typing
 */
describe('[Botmation] actions/input', () => {
  let browser: Browser
  let page: Page

  const inputCopy = 'My cat is black'

  beforeAll(async() => {
    browser = await puppeteer.launch()
  })

  afterAll(async() => {
    await browser.close()
  })

  //
  // Basic Integration Tests
  it('should call puppeteer\'s page click method with the provided DOM selector', async () => {
    const mockPage = {
      click: jest.fn()
    } as any as Page

    await click(FORM_SUBMIT_BUTTON_SELECTOR)(mockPage)

    expect(mockPage.click).toBeCalledWith('form button[type="submit"]')
  })

  it('should call puppeteer\'s page keyboard type method with the provided copy', async () => {
    const mockPage = {
      keyboard: {
        type: jest.fn()
      }
    } as any as Page

    await type(inputCopy)(mockPage)

    expect(mockPage.keyboard.type).toBeCalledWith('My cat is black')
  })

  //
  // Unit test of these actions for clicking and typing as wrapped BotAction factory methods
  it('should focus on input, by click(), then type() "My cat is black" into it', async() => {
    // test prep
    page = await browser.newPage()
    await page.goto(BASE_URL)

    // test
    await click(FORM_TEXT_INPUT_SELECTOR)(page)
    await type(inputCopy)(page)

    const formInputEl = await page.$(FORM_TEXT_INPUT_SELECTOR)
    const formInputValue = await formInputEl?.getProperty('value')
    const formInputValueJSON = await formInputValue?.jsonValue()

    expect(formInputValueJSON).toEqual('My cat is black')

    await page.close()
  })

  it('clickText should click the element with the text provided', async() => {
    page = await browser.newPage()
    await page.goto(BASE_URL)

    await clickText('Example Link 2')(page)
    await page.waitForNavigation()
    await clickText('dlkfjnsldkfjslkdfjbslkfdjbsdfg')(page) // can attempt to click soemthing that doesn't exist

    expect(page.url()).toEqual('http://localhost:8080/example2.html')
  })

})
