/**
 * Roll a dice with the given number of sides
 * @param numberOfDiceSides n where n >= 1
 *  if n is 0 or negative, then return value is 0
 * @return 1 -> n (including n)
 */
export const diceRoll = (numberOfDiceSides = 1): number =>
  numberOfDiceSides >= 1 ?
  Math.floor(Math.random() * numberOfDiceSides) + 1 :
  0
