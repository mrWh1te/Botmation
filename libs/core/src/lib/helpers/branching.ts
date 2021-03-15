/**
 * Roll a dice with the given number of sides
 * @param numberOfDiceSides
 * @return the value the dice landed on
 */
export const diceRoll = (numberOfDiceSides = 1): number =>
  Math.floor(Math.random() * numberOfDiceSides) + 1
