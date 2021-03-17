import { BotAction } from '../interfaces/bot-actions'
import { assemblyLine } from './assembly-lines'
import { randomDiceRoll, randomDecimal } from '../helpers/random'

/**
 * Run assembled BotActions ONLY if a virtually rolled dice lands on the number to roll
 *  This works for probabilitilities of 50% or less. For higher probabilities, use the probably()() BotAction
 * @future once sync BotActions are supported, update with givenThat()() using a function wrapper to convert diceRoll() into a boolean expression (dice roll correct number or not)
 * @param numberOfDiceSides
 * @param numberToRoll
 */
export const rollDice =
  (numberOfDiceSides = 1, numberToRoll = 1) =>
    (...actions: BotAction[]): BotAction =>
      async(page, ...injects) => {
        if (randomDiceRoll(numberOfDiceSides) === numberToRoll) {
          return assemblyLine()(...actions)(page, ...injects)
        }
      }

/**
 * Run assembled BotActions based on a probability
 *  if random number generated is within the probability range, then assembled BotActions are ran
 *  ie if probability is 60% then all numbers generated 0-60 will cause actions to run and all numbers generated 61-100 will cause nothing
 * @param probability number 0-1 ie .6 = 60%
 */
export const probably =
  (probability = 1) =>
    (...actions: BotAction[]): BotAction =>
      async(page, ...injects) => {
        if (randomDecimal() <= probability) {
          return assemblyLine()(...actions)(page, ...injects)
        }
      }
