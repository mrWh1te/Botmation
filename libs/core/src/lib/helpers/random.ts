/**
 * @return decimal between 0-1
 */
export const randomDecimal = (randomDecimalGenerator = Math.random): number =>
  randomDecimalGenerator()
