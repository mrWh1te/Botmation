import { BotAction } from '../interfaces/bot-actions'
import { assemblyLine, pipe } from './assembly-lines'
import { randomDecimal } from '../helpers/random'
import { inject } from './inject'
import { errors } from './errors'
import { unpipeInjects } from '../helpers/pipe'

/**
 * @description   Inject a random decimal number generator
 *
 * @param generateRandomDecimalFunction
 */
export const randomGenerator = (generateRandomDecimalFunction: Function) =>
  (...actions: BotAction[]): BotAction =>
    pipe()(
      inject(generateRandomDecimalFunction)(
        errors('randomGenerator()()')(...actions)
      )
    )

/**
 * Roll a virtual device with number of dice sides (default is 1). If the dice rolls a 1, the assembled BotActions run
 *  Works for probabilitilities of 50% or less (dice with 2 sides or more). For higher probabilities, use probably()() directly
 * @param numberOfDiceSides
 * @param numberToRoll
 */
export const rollDice =
  (numberOfDiceSides = 1, generateRandomDecimal?: () => number) =>
    (...actions: BotAction[]): BotAction =>
      probably(1 / numberOfDiceSides, generateRandomDecimal)(...actions)

/**
 * Run assembled BotActions based on a probability
 *  if random number generated is within the probability range, then assembled BotActions are ran
 *  ie if probability is 60% then all numbers generated 0-60 will cause actions to run and all numbers generated 61-100 will cause nothing
 * @future use givenThat() with a wrapper function post v2 (support sync BotActions and decomposed `page` from params into an inject)
 * @param probability represented as a decimal ie .6 = 60% chance of running assembled BotActions
 * @param generateRandomDecimal function to generate a random decimal between 0 and 1 with default set to randomDecimal helper that uses a pseudo random method
 */
export const probably =
  (probability = .6, generateRandomDecimal?: () => number) =>
    (...actions: BotAction[]): BotAction =>
      async(page, ...injects) => {
        if (!generateRandomDecimal) {
          const [,injectedRandomDecimalGenerator] = unpipeInjects(injects, 1)

          if (typeof injectedRandomDecimalGenerator === 'function') {
            generateRandomDecimal = injectedRandomDecimalGenerator // once injects becomes Map based :)
          } else {
            generateRandomDecimal = randomDecimal
          }
        }

        if (generateRandomDecimal() <= probability) {
          return assemblyLine()(...actions)(page, ...injects)
        }
      }

