import { Page } from 'puppeteer'

import { click, type } from "@mationbot/actions/input"

/**
 * @description   Input Action Factory
 *                The factory methods here return BotAction's for the bots to input into the page as User
 *                  ie mouse click, keyboard typing
 */
describe('[MationBot:Action Factory] Input', () => {
  const inputDOMSelector = 'html body form input'
  const buttonDOMSelector = 'html body form button'

  const inputCopy = 'My cat is black'

  beforeAll(async() => {
    await page.goto('http://localhost:8080')
  })

  //
  // Basic Integration Tests
  it('should call puppeteer\'s page click method with the provided DOM selector', async () => {
    const mockPage = {
      click: jest.fn()
    }
    
    await click(buttonDOMSelector)(mockPage as any as Page)

    await expect(mockPage.click).toBeCalledWith('html body form button')
  })

  it('should call puppeteer\'s page keyboard type method with the provided copy', async () => {
    const mockPage = {
      keyboard: {
        type: jest.fn()
      }
    }
    
    await type(inputCopy)(mockPage as any as Page)

    await expect(mockPage.keyboard.type).toBeCalledWith('My cat is black')
  })

  //
  // Unit test of these actions for clicking and typing as wrapped BotAction factory methods
  it('should focus on input, by click(), then type() "My cat is black" into it', async() => {
    await click(inputDOMSelector)(page)
    await type(inputCopy)(page)

    const formInputEl = await page.$(inputDOMSelector)
    const formInputValue = await formInputEl?.getProperty('value')
    const formInputValueJSON = await formInputValue?.jsonValue()

    await expect(formInputValueJSON).toEqual('My cat is black')
  })
  
})
