import 'expect-puppeteer'
import { Page } from 'puppeteer'

import { click, type } from 'botmation/actions/input'
import { goTo, waitForNavigation } from 'botmation/actions/navigation'
import { Botmation } from 'botmation/class'

import { BASE_URL, EXAMPLE_URL } from '../urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '../selectors'
import { chain } from 'botmation/actions/assembly-lines'
import { errors } from 'botmation/actions/errors'

/**
 * @description   E2E
 */
describe('[Botmation] e2e', () => {

  let newPage: Page

  beforeEach(async() => {
    newPage = await browser.newPage()
  })
  afterEach(async() => {
    await newPage.close()
  })

  //
  // Functional
  it('should run a chain of actions which submits the example form', async() => {
    await chain(
      goTo(BASE_URL),
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR),
      waitForNavigation
    )(newPage)

    expect(newPage.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsum')
  })

  it('should run a chain of actions which submits the example form with errors() wrapping', async() => {
    await chain(
      errors('chain-test')(
        goTo(BASE_URL),
        goTo(EXAMPLE_URL),
        click(FORM_TEXT_INPUT_SELECTOR),
        type('loremlipsum2'),
        click(FORM_SUBMIT_BUTTON_SELECTOR),
        waitForNavigation
      )
    )(newPage)

    expect(newPage.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsum2')
  })

  //
  // Botmation Class Instance
  it('should create a Botmation instance then run the actions to submit the example form', async() => {
    const bot = new Botmation(newPage)

    await bot.actions(
      goTo(BASE_URL),
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR),
      waitForNavigation
    )

    expect(newPage.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsum')
  })

})
