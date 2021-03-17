import { randomDecimal } from './random'

/**
 * @description   Random Helpers
 *  These functions focus on randomness
 */
describe('[Botmation] helpers/random', () => {

  it('randomDecimal() returns a pseudorandom decimal between 0 to 1', () => {
    for(let i = 0; i < 100; i++) {
      const randomDecimalValue = randomDecimal()
      expect(randomDecimalValue).toBeGreaterThanOrEqual(0)
      expect(randomDecimalValue).toBeLessThanOrEqual(1)
    }
  })

})
