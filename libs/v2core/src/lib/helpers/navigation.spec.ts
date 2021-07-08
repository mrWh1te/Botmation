
import { WaitForOptions } from 'puppeteer'
import { enrichGoToPageOptions, scrollToElement } from './navigation'

const mockScrollIntoView = jest.fn()
const mockQuerySelectorFactory = (timesRan = 0) => jest.fn(() => {
  if (timesRan === 0) {
    timesRan++
    return {
      scrollIntoView: mockScrollIntoView
    }
  } else {
    return null // for the case of not element found, querySelector() returns null
  }
})

const mockQuerySelector = mockQuerySelectorFactory()

// Setup document query selector methods
Object.defineProperty(global, 'document', {
  value: {
    querySelector: mockQuerySelector,
    addEventListener: () => {}
  }
})

/**
 * @description   Navigation Helpers
 */
describe('[Botmation] helpers/navigation', () => {
  it('scrollToElement() is a function evaluated in the browser the gets an element based on html selector then calls its scrollIntoView() method', () => {
    scrollToElement('teddy bear')

    // 1st time running mock document object, it will have a scrollIntoView function
    expect(mockQuerySelector).toHaveBeenNthCalledWith(1, 'teddy bear')
    expect(mockScrollIntoView).toHaveBeenNthCalledWith(1, {behavior: 'smooth'})

    // subsequent calls of mock document object querySelector will result in null
    scrollToElement('blanket')

    expect(mockQuerySelector).toHaveBeenNthCalledWith(2, 'blanket')
    expect(mockScrollIntoView).not.toHaveBeenCalledTimes(2)
  })

  it('enrichGoToPageOptions() should take a partial of Puppeteer.WaitForOptions to overload the default values it provides in one as a safe fallback', () => {
    const waitForOptionsEmpty: Partial<WaitForOptions> = {}
    const waitForOptionsWaitUntil: Partial<WaitForOptions> = {waitUntil: 'domcontentloaded'}

    const enrichWaitForOptionsFromUndefined = enrichGoToPageOptions()
    const enrichWaitForOptionsFromEmpty = enrichGoToPageOptions(waitForOptionsEmpty)
    const enrichWaitForOptionsFromWaitUntil = enrichGoToPageOptions(waitForOptionsWaitUntil)

    // default cases (safe fallbacks)
    expect(enrichWaitForOptionsFromUndefined).toEqual({
      waitUntil: 'networkidle0'
    })
    expect(enrichWaitForOptionsFromEmpty).toEqual({
      waitUntil: 'networkidle0'
    })

    // overwriting default
    expect(enrichWaitForOptionsFromWaitUntil).toEqual({
      waitUntil: 'domcontentloaded'
    })
  })

})
