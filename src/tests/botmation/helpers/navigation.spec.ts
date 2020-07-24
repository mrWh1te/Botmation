
import { DirectNavigationOptions } from 'puppeteer'
import { enrichGoToPageOptions } from 'botmation/helpers/navigation'

/**
 * @description   Navigation Helpers
 */
describe('[Botmation] helpers/navigation', () => {

  it('enrichGoToPageOptions() should take a partial of Puppeteer.DirectNavigationOptions to overload the default values it provides in one as a safe fallback', () => {
    const directNavigationOptionsEmpty: Partial<DirectNavigationOptions> = {}
    const directNavigationOptionsWaitUntil: Partial<DirectNavigationOptions> = {waitUntil: 'domcontentloaded'}

    const enrichDirectNavigationOptionsFromUndefined = enrichGoToPageOptions()
    const enrichDirectNavigationOptionsFromEmpty = enrichGoToPageOptions(directNavigationOptionsEmpty)
    const enrichDirectNavigationOptionsFromWaitUntil = enrichGoToPageOptions(directNavigationOptionsWaitUntil)

    // default cases (safe fallbacks)
    expect(enrichDirectNavigationOptionsFromUndefined).toEqual({
      waitUntil: 'networkidle0'
    })
    expect(enrichDirectNavigationOptionsFromEmpty).toEqual({
      waitUntil: 'networkidle0'
    })

    // overwriting default
    expect(enrichDirectNavigationOptionsFromWaitUntil).toEqual({
      waitUntil: 'domcontentloaded'
    })
  })

})
