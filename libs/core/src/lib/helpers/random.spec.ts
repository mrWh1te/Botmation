import { calculateDiceRoll, randomDecimal } from './random'

/**
 * @description   Random Helpers
 *  These functions focus on randomness
 */
describe('[Botmation] helpers/random', () => {

  //
  // Unit Test
  it('calculateDiceRoll() returns a random number from 1 to n where n is the numberOfDiceSides', () => {
    const noParams = calculateDiceRoll()
    const diceWithTwoSides = calculateDiceRoll(2)
    const diceWithNineSides = calculateDiceRoll(9)
    const diceWithTwentyFiveSides = calculateDiceRoll(25)

    expect(noParams).toEqual(1)

    expect(diceWithTwoSides).toBeGreaterThanOrEqual(1)
    expect(diceWithTwoSides).toBeLessThanOrEqual(2)

    expect(diceWithNineSides).toBeGreaterThanOrEqual(1)
    expect(diceWithNineSides).toBeLessThanOrEqual(9)

    expect(diceWithTwentyFiveSides).toBeGreaterThanOrEqual(1)
    expect(diceWithTwentyFiveSides).toBeLessThanOrEqual(25)

    // unique edge cases
    const diceWithZeroSides = calculateDiceRoll(0)
    const diceWithNegativeOneSide = calculateDiceRoll(-1)
    const diceWithNegativeSides = calculateDiceRoll(-10)

    expect(diceWithZeroSides).toEqual(0)
    expect(diceWithNegativeOneSide).toEqual(0)
    expect(diceWithNegativeSides).toEqual(0)
  })

  it('randomDecimal() returns a pseudorandom decimal between 0 to 1', () => {
    for(let i = 0; i < 100; i++) {
      const randomDecimalValue = randomDecimal()
      expect(randomDecimalValue).toBeGreaterThanOrEqual(0)
      expect(randomDecimalValue).toBeLessThanOrEqual(1)
    }
  })

})
