import { clickElementWithText } from '../helpers/input'
import { Action } from '@botmation/v2core'
import { evaluate } from './scrape'
import { injectsPage } from '../types/injects'

/**
 * @description   Manually left-click an HTML element on the page given the provided HTML selector
 * @param selector
 */
export const click = (selector: string): Action<injectsPage> => async({page}) =>
  page.click(selector)


/**
 * Click the element in the DOM with the provided text
 * @param text
 */
export const clickText = (text: string): Action<injectsPage> =>
  evaluate(clickElementWithText, text)

/**
 * @description   Types the `copy` provided with a "keyboard"
 *                Can be used to fill text based form fields
 * @param copy
 */
export const type = (copy: string): Action<injectsPage> => async({page}) =>
  page.keyboard.type(copy)
