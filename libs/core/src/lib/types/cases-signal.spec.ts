import { CasesSignal, isCasesSignal } from '@botmation/core'
import { wrapValueInPipe } from '@botmation/core'

/**
 * @description   CasesSignal Type guard function
 */
describe('[Botmation] types/cases-signal', () => {

  //
  // Unit Test
  it('isCasesSignal() returns boolean true if the provided param is an Object that matches the minimum requirements for the MatchesSignal type', () => {
    // pass
    const emptyCasesSignal: CasesSignal = {
      brand: 'Cases_Signal',
      conditionPass: false,
      matches: {}
    }
    const casesSignal: CasesSignal = {
      brand: 'Cases_Signal',
      conditionPass: true,
      matches: {
        3: 'dog',
        7: 'cat'
      }
    }
    const casesSignalWithPipeValue: CasesSignal = {
      brand: 'Cases_Signal',
      conditionPass: true,
      matches: {
        2: 'bird',
        17: 'cow'
      },
      pipeValue: 'aim for the stars and land on the moon'
    }

    // fails
    const pipeObject = wrapValueInPipe('hey')
    const likeCasesSignalButArray = {
      brand: 'Cases_Signal',
      matches: []
    }
    const likeCasesSignalButNull = {
      brand: 'Cases_Signal',
      matches: null
    }
    const likeCasesSignalButWrongBrand = {
      brand: 'Cases_Signal_',
      matches: {}
    }
    const likeCasesSignalButWrongConditionPassType = {
      brand: 'Cases_Signal',
      matches: {},
      conditionPass: 'pass'
    }

    // pass
    expect(isCasesSignal(emptyCasesSignal)).toEqual(true)
    expect(isCasesSignal(casesSignal)).toEqual(true)
    expect(isCasesSignal(casesSignalWithPipeValue)).toEqual(true)

    // fail
    expect(isCasesSignal(pipeObject)).toEqual(false)
    expect(isCasesSignal(likeCasesSignalButArray)).toEqual(false)
    expect(isCasesSignal(likeCasesSignalButNull)).toEqual(false)
    expect(isCasesSignal(likeCasesSignalButWrongBrand)).toEqual(false)
    expect(isCasesSignal(likeCasesSignalButWrongConditionPassType)).toEqual(false)
  })

})
