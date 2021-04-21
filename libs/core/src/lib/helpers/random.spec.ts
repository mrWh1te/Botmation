import { generateRandomDecimal } from './random'

/**
 * @description   Random Helpers
 *  These functions focus on randomness
 */
describe('[Botmation] helpers/random', () => {

  it('generateRandomDecimal() returns a pseudorandom decimal between 0 to 1', () => {
    for(let i = 0; i < 100; i++) {
      const generateRandomDecimalValue = generateRandomDecimal()
      expect(generateRandomDecimalValue).toBeGreaterThan(0)
      expect(generateRandomDecimalValue).toBeLessThan(1)
    }
  })

})
