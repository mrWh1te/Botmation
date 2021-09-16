import { Action } from '@botmation/v2core'

import { Injects } from '../types'

import { assemblyLine } from './assembly-lines'
import { generateRandomDecimal } from '../helpers/random'
import { inject } from './inject'
import { errors } from './errors'
import { NumberReturningFunc } from '../types/random'

export type injectsRandom = Injects & {randomDecimal: NumberReturningFunc}

/**
 * @description   Inject a random decimal number generator
 *
 * @param injectGenerateRandomDecimalFunction
 */
export const randomDecimal = (injectGenerateRandomDecimalFunction: NumberReturningFunc) =>
  (...actions: Action[]): Action =>
    inject({randomDecimal: injectGenerateRandomDecimalFunction})(
      errors('randomDecimal()()')(...actions)
    )

/**
 * Roll a virtual device with number of dice sides (default is 1). If the dice rolls a 1, the assembled Actions run
 *  Works for probabilitilities of 50% or less (dice with 2 sides or more). For higher probabilities, use probably()() directly
 * @param numberOfDiceSides
 * @param numberToRoll
 */
export const rollDice =
  (numberOfDiceSides = 1, overloadGenerateRandomDecimal?: NumberReturningFunc) =>
    (...actions: Action[]): Action<injectsRandom> =>
      probably(1 / numberOfDiceSides, overloadGenerateRandomDecimal)(...actions)

/**
 * Run assembled Actions based on a probability
 *  if random number generated is within the probability range, then assembled Actions are ran
 *  ie if probability is 60% then all numbers generated 0-60 will cause actions to run and all numbers generated 61-100 will cause nothing
 * @future use givenThat() with a wrapper function post v2 (support sync Actions and decomposed `page` from params into an inject)
 * @param probability represented as a decimal ie .6 = 60% chance of running assembled Actions
 * @param randomDecimal function to generate a random decimal between 0 and 1 with default set to randomDecimal helper that uses a pseudo random method
 */
export const probably =
  (probability = .6, randomDecimal?: NumberReturningFunc) =>
    (...actions: Action[]): Action<injectsRandom> =>
      async({randomDecimal: injectRandomDecimal, ...otherInjects}) => {
        randomDecimal ??= injectRandomDecimal ??= generateRandomDecimal

        if (randomDecimal() <= probability) {
          return assemblyLine()(...actions)({randomDecimal, ...otherInjects})
        }
      }

