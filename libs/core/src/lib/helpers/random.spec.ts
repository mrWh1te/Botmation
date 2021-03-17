import { randomDiceRoll, randomDecimal } from './random'

/**
 * @description   Random Helpers
 *  These functions focus on randomness
 */
describe('[Botmation] helpers/random', () => {

  //
  // Unit Test
  it('randomDiceRoll() returns a random number from 1 to n where n is the numberOfDiceSides', () => {
    const noParams = randomDiceRoll()
    const diceWithTwoSides = randomDiceRoll(2)
    const diceWithNineSides = randomDiceRoll(9)
    const diceWithTwentyFiveSides = randomDiceRoll(25)

    expect(noParams).toEqual(1)

    expect(diceWithTwoSides).toBeGreaterThanOrEqual(1)
    expect(diceWithTwoSides).toBeLessThanOrEqual(2)

    expect(diceWithNineSides).toBeGreaterThanOrEqual(1)
    expect(diceWithNineSides).toBeLessThanOrEqual(9)

    expect(diceWithTwentyFiveSides).toBeGreaterThanOrEqual(1)
    expect(diceWithTwentyFiveSides).toBeLessThanOrEqual(25)

    // unique edge cases
    const diceWithZeroSides = randomDiceRoll(0)
    const diceWithNegativeOneSide = randomDiceRoll(-1)
    const diceWithNegativeSides = randomDiceRoll(-10)

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
