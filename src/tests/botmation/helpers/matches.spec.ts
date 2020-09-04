import { createMatchesSignal, hasAtLeastOneMatch } from 'botmation/helpers/matches'

/**
 * @description   Matches Helpers
 */
describe('[Botmation] helpers/matches', () => {
  
  //
  // Unit Test
  it('createMatchesSignal() creates a `MatchesSignal` object with safe intuitive defaults if no params are provided to set the object\'s values', () => {
    const noParams = createMatchesSignal()
    const overrideSafeDefaultsWithThoseValues = createMatchesSignal({}, undefined)
    const fiveMatches = createMatchesSignal({'1': 'bear', '2': 'lion', '3': 'bird', '4': 'mountain', '5': 'cloud'})
    const matchesWithPipeValue = createMatchesSignal({'4': 'cat', '6': 'dog'}, 'test-pipe-value-983')

    const matchesWithNumberKeys = createMatchesSignal({5: 'sfd'}) // serialization will convert them into strings

    expect(noParams).toEqual({
      brand: 'Matches_Signal',
      matches: {}
    })
    expect(overrideSafeDefaultsWithThoseValues).toEqual({
      brand: 'Matches_Signal',
      matches: {}
    })
    expect(fiveMatches).toEqual({
      brand: 'Matches_Signal',
      matches: {'1': 'bear', '2': 'lion', '3': 'bird', '4': 'mountain', '5': 'cloud'}
    })
    expect(matchesWithPipeValue).toEqual({
      brand: 'Matches_Signal',
      matches: {'4': 'cat', '6': 'dog'},
      pipeValue: 'test-pipe-value-983'
    })

    expect(matchesWithNumberKeys).toEqual({
      brand: 'Matches_Signal',
      matches: {'5': 'sfd'}
    })
  })

  it('hasAtLeastOneMatch() returns a boolean, TRUE if the provided MatchesSignal has at least one match otherwise FALSE', () => {
    const signalWithZeroMatches = createMatchesSignal()
    const signalWithZeroMatchesAndPipeValue = createMatchesSignal({}, 'a pipe vlaue')

    const signalWithOneMatch = createMatchesSignal({8: 'cat'})
    const signalWithOneMatchAndPipeValue = createMatchesSignal({8: 'cat'}, 'another pipe value')

    const signalWithMultipleMatches = createMatchesSignal({2: 'dog', 93: 'elephant'})
    const signalWithMultipleMatchesAndPipeValue = createMatchesSignal({2: 'dog', 93: 'elephant'}, 'another another pipe value')

    expect(hasAtLeastOneMatch(signalWithZeroMatches)).toEqual(false)
    expect(hasAtLeastOneMatch(signalWithZeroMatchesAndPipeValue)).toEqual(false)

    expect(hasAtLeastOneMatch(signalWithOneMatch)).toEqual(true)
    expect(hasAtLeastOneMatch(signalWithOneMatchAndPipeValue)).toEqual(true)
    expect(hasAtLeastOneMatch(signalWithMultipleMatches)).toEqual(true)
    expect(hasAtLeastOneMatch(signalWithMultipleMatchesAndPipeValue)).toEqual(true)

  })

})
