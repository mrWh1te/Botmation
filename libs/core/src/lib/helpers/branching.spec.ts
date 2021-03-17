import { diceRoll } from './branching'

/**
 * @description   Branching Helpers
 */
describe('[Botmation] helpers/branching', () => {

  //
  // Unit Test
  it('diceRoll() returns a random number from 1 to n where n is the numberOfDiceSides', () => {
    const noParams = diceRoll()
    const diceWithTwoSides = diceRoll(2)
    const diceWithNineSides = diceRoll(9)
    const diceWithTwentyFiveSides = diceRoll(25)

    expect(noParams).toEqual(1)

    expect(diceWithTwoSides).toBeGreaterThanOrEqual(1)
    expect(diceWithTwoSides).toBeLessThanOrEqual(2)

    expect(diceWithNineSides).toBeGreaterThanOrEqual(1)
    expect(diceWithNineSides).toBeLessThanOrEqual(9)

    expect(diceWithTwentyFiveSides).toBeGreaterThanOrEqual(1)
    expect(diceWithTwentyFiveSides).toBeLessThanOrEqual(25)

    // unique edge cases
    const diceWithZeroSides = diceRoll(0)
    const diceWithNegativeOneSide = diceRoll(-1)
    const diceWithNegativeSides = diceRoll(-10)

    expect(diceWithZeroSides).toEqual(0)
    expect(diceWithNegativeOneSide).toEqual(0)
    expect(diceWithNegativeSides).toEqual(0)
  })

})
