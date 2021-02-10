import { createCasesSignal, casesSignalToPipeValue } from '@botmation/core'

/**
 * @description   Cases Helpers
 *  A case is like a piece of a condition to evaluate for true, such then some code may by executed ie if (case || case2 || case3) then {}
 */
describe('[Botmation] helpers/cases', () => {

  //
  // Unit Test
  it('createCasesSignal() creates a `CasesSignal` object with safe intuitive defaults if no params are provided to set the object\'s values', () => {
    const noParams = createCasesSignal()
    const overrideSafeDefaultsWithThoseValues = createCasesSignal({}, false, undefined)
    const fiveMatches = createCasesSignal({'1': 'bear', '2': 'lion', '3': 'bird', '4': 'mountain', '5': 'cloud'}, true) // five passing cases to make the condition pass
    const matchesWithPipeValue = createCasesSignal({'4': 'cat', '6': 'dog'}, true, 'test-pipe-value-983')

    const casesWithNumberKeysButNotCondition = createCasesSignal({5: 'sfd'}, false) // serialization will convert them into strings
    const casesWithNumberKeysAndCondition = createCasesSignal({7: 'sfdhg'}, true)

    expect(noParams).toEqual({
      brand: 'Cases_Signal',
      matches: {},
      conditionPass: false
    })
    expect(overrideSafeDefaultsWithThoseValues).toEqual({
      brand: 'Cases_Signal',
      matches: {},
      conditionPass: false
    })
    expect(fiveMatches).toEqual({
      brand: 'Cases_Signal',
      matches: {'1': 'bear', '2': 'lion', '3': 'bird', '4': 'mountain', '5': 'cloud'},
      conditionPass: true
    })
    expect(matchesWithPipeValue).toEqual({
      brand: 'Cases_Signal',
      matches: {'4': 'cat', '6': 'dog'},
      conditionPass: true,
      pipeValue: 'test-pipe-value-983'
    })

    expect(casesWithNumberKeysButNotCondition).toEqual({
      brand: 'Cases_Signal',
      matches: {'5': 'sfd'},
      conditionPass: false
    })

    expect(casesWithNumberKeysAndCondition).toEqual({
      brand: 'Cases_Signal',
      matches: {'7': 'sfdhg'},
      conditionPass: true
    })

  })

  it('casesSignalToPipeValue() safely returns a CasesSignal pipeValue property even if not given a CasesSignal', () => {
    const undefinedValue = casesSignalToPipeValue(undefined)
    const nullValue = casesSignalToPipeValue(null)
    const casesSignalNoPipeValue = casesSignalToPipeValue(createCasesSignal())
    const casesSignalWithPipeValue = casesSignalToPipeValue(createCasesSignal({}, false, 'pipe-value-to-confirm'))

    expect(undefinedValue).toBeUndefined()
    expect(nullValue).toBeUndefined()

    expect(casesSignalNoPipeValue).toBeUndefined()
    expect(casesSignalWithPipeValue).toEqual('pipe-value-to-confirm')
  })

})
