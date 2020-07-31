// import 'expect-puppeteer'

import { click, type } from 'botmation/actions/input'
import { goTo, waitForNavigation } from 'botmation/actions/navigation'
import { Botmation } from 'botmation/class'

import { BASE_URL, EXAMPLE_URL } from '../urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '../selectors'

/**
 * @description   E2E
 */
describe('[Botmation] Botmation class e2e', () => {

  //
  // Botmation Class Instance
  it('should create a Botmation instance then run the actions to submit the example form', async() => {
    const bot = new Botmation(page)

    await bot.actions(
      goTo(BASE_URL),
      goTo(EXAMPLE_URL),
      click(FORM_TEXT_INPUT_SELECTOR),
      type('loremlipsum'),
      click(FORM_SUBMIT_BUTTON_SELECTOR),
      waitForNavigation
    )

    expect(page.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsum')
  })

})
