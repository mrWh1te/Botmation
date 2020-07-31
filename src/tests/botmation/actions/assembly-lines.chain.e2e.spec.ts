import 'expect-puppeteer'

import { click, type } from 'botmation/actions/input'
import { goTo, waitForNavigation } from 'botmation/actions/navigation'

import { BASE_URL, EXAMPLE_URL } from '../../urls'
import { FORM_TEXT_INPUT_SELECTOR, FORM_SUBMIT_BUTTON_SELECTOR } from '../../selectors'
import { chain } from 'botmation/actions/assembly-lines'
import { errors } from 'botmation/actions/errors'

/**
 * @description   E2E
 */
describe('[Botmation] actions/assembly-lines chain() e2e', () => {

  //
  // Functional
  it('should run a chain of actions which submits the example form with errors() wrapping', async() => {
    await chain(
      // errors('chain-test')(
        goTo(BASE_URL),
        goTo(EXAMPLE_URL),
        click(FORM_TEXT_INPUT_SELECTOR),
        type('loremlipsum2'),
        click(FORM_SUBMIT_BUTTON_SELECTOR),
        waitForNavigation
      // )
    )(page)

    expect(page.url()).toEqual('http://localhost:8080/success.html?answer=loremlipsum2')
  })

})
