import { getElementOuterHTML, getElementsOuterHTML } from "botmation/helpers/scrapers"

/**
 * This higher-order function returns a function with scoped data from the higher-order context allowing the function instance to have a kind of state to differentiate the return results based on numebr of times ran to for varying tests
 * @param timesRan 
 */
const mockQuerySelector = (timesRan = 0) => () => {
  if (timesRan > 0) {
    return undefined
  }

  timesRan++;
  return {outerHTML: '<test-html></test-html>'}
}

const mockQuerySelectorAll = (timesRan = 0) => () => {
  if (timesRan > 0) {
    return []
  }

  timesRan++;
  return [{outerHTML: '<test-html></test-html><test-html></test-html>'}, {outerHTML: '<test-html></test-html><test-html></test-html>'}]
}

// Setup document query selector methods
Object.defineProperty(global, 'document', { 
  value: {
    querySelector: mockQuerySelector(),
    querySelectorAll: mockQuerySelectorAll()
  }
})


/**
 * @description   Scrapers Helpers
 */
describe('[Botmation] helpers/scrapers', () => {

  // Basic integration tests
  it('returns escaped HTML in string when element is found in page otherwise undefined', () => {
    // run test code
    const elHTML = getElementOuterHTML('first-test-run-exists')
    const notFoundElementHTML = getElementOuterHTML('second-following-runs-do-not')

    // confirm results
    expect(elHTML).toEqual('<test-html></test-html>')
    expect(notFoundElementHTML).toBeUndefined()
  })

  it('returns array of strings representing html of elements found matching selector otherwise empty array', () => {
    // run test code
    const elsHTML = getElementsOuterHTML('first-test-run-exists')
    const notFoundElementsHTML = getElementsOuterHTML('second-following-runs-do-not')

    // confirm results
    expect(elsHTML).toEqual(['<test-html></test-html><test-html></test-html>', '<test-html></test-html><test-html></test-html>'])
    expect(notFoundElementsHTML).toEqual([])
  })

  afterAll(() => {
    jest.unmock('botmation/actions/inject')
  })
})
