import { MatchesSignal, isMatchesSignal } from 'botmation/types/matches-signal'
import { wrapValueInPipe } from 'botmation/helpers/pipe'

/**
 * @description   MatchesSignal Type guard function
 */
describe('[Botmation] types/matches-signal', () => {

  //
  // Unit Test
  it('isMatchesSignal() returns boolean true if the provided param is an Object that matches the minimum requirements for the MatchesSignal type', () => {
    // pass
    const emptyMatchesSignal: MatchesSignal = {
      brand: 'Matches_Signal',
      matches: {}
    }
    const matchesSignal: MatchesSignal = {
      brand: 'Matches_Signal',
      matches: {
        3: 'dog',
        7: 'cat'
      }
    }
    const matchesSignalWithPipeValue: MatchesSignal = {
      brand: 'Matches_Signal',
      matches: {
        2: 'bird',
        17: 'cow'
      },
      pipeValue: 'aim for the stars and land on the moon'
    }
    
    // fails
    const pipeObject = wrapValueInPipe('hey')
    const likeMatchesSignalButArray = {
      brand: 'Matches_Signal',
      matches: []
    }
    const likeMatchesSignalButNull = {
      brand: 'Matches_Signal',
      matches: null
    }
    const likeMatchesSignalButWrongBrand = {
      brand: 'Matches_Signal_',
      matches: {}
    }

    // pass
    expect(isMatchesSignal(emptyMatchesSignal)).toEqual(true)
    expect(isMatchesSignal(matchesSignal)).toEqual(true)
    expect(isMatchesSignal(matchesSignalWithPipeValue)).toEqual(true)
    
    // fail
    expect(isMatchesSignal(pipeObject)).toEqual(false)
    expect(isMatchesSignal(likeMatchesSignalButArray)).toEqual(false)
    expect(isMatchesSignal(likeMatchesSignalButNull)).toEqual(false)
    expect(isMatchesSignal(likeMatchesSignalButWrongBrand)).toEqual(false)
  })

})
