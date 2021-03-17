/**
 * Roll a dice with the given number of sides
 * @param numberOfDiceSides n where n >= 1
 *  if n is 0 or negative, then return value is 0
 * @return 1 -> n (including n)
 */
export const calculateDiceRoll = (numberOfDiceSides = 1): number =>
  numberOfDiceSides >= 1 ?
  Math.floor(randomDecimal() * numberOfDiceSides) + 1 :
  0

/**
 * @return decimal 0-1
 */
export const randomDecimal = (): number =>
  Math.random()
