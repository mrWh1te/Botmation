import { Page } from 'puppeteer'

import { click, type } from "botmation/actions/input"

import { FORM_SUBMIT_BUTTON_SELECTOR, FORM_TEXT_INPUT_SELECTOR } from '@tests/selectors'
import { BASE_URL } from '@tests/urls'

/**
 * @description   Input Action Factory
 *                The factory methods here return BotAction's for the bots to input into the page as User
 *                  ie mouse click, keyboard typing
 */
describe('[MationBot:Action Factory] Input', () => {
  const inputCopy = 'My cat is black'

  beforeAll(async() => {
    await page.goto(BASE_URL)
  })

  //
  // Basic Integration Tests
  it('should call puppeteer\'s page click method with the provided DOM selector', async () => {
    const mockPage = {
      click: jest.fn()
    }
    
    await click(FORM_SUBMIT_BUTTON_SELECTOR)(mockPage as any as Page)

    expect(mockPage.click).toBeCalledWith('form button[type="submit"]')
  })

  it('should call puppeteer\'s page keyboard type method with the provided copy', async () => {
    const mockPage = {
      keyboard: {
        type: jest.fn()
      }
    }
    
    await type(inputCopy)(mockPage as any as Page)

    expect(mockPage.keyboard.type).toBeCalledWith('My cat is black')
  })

  //
  // Unit test of these actions for clicking and typing as wrapped BotAction factory methods
  it('should focus on input, by click(), then type() "My cat is black" into it', async() => {
    await click(FORM_TEXT_INPUT_SELECTOR)(page)
    await type(inputCopy)(page)

    const formInputEl = await page.$(FORM_TEXT_INPUT_SELECTOR)
    const formInputValue = await formInputEl?.getProperty('value')
    const formInputValueJSON = await formInputValue?.jsonValue()

    expect(formInputValueJSON).toEqual('My cat is black')
  })
  
})
