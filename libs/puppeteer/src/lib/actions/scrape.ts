/**
 * Action's dedicated to scraping web pages
 */
import { EvaluateFn } from 'puppeteer'
import * as cheerio from 'cheerio'

import { Action, inject } from '@botmation/v2core'

import { errors } from '@botmation/core'

import { elementExistsInDocument, getElementOuterHTML, getElementsOuterHTML, textExistsInDocument } from '../helpers/scrapers'
import { InjectHtmlParser, InjectPage } from '../types/injects'

/**
 * A ConditionalAction to return a Boolean value
 *    True if element is found, false if element is not found
 * @param elementSelector
 */
export const elementExists = (elementSelector: string): Action<InjectPage> =>
  evaluate(elementExistsInDocument, elementSelector)

/**
 *
 * @param text
 */
export const textExists = (text: string): Action<InjectPage> =>
  evaluate(textExistsInDocument, text)

/**
 * @description   Inject htmlParser for ScraperAction's
 *
 * @param htmlParserFunction
 */
export const htmlParser = (htmlParserFunction: Function) =>
  (...actions: Action[]): Action =>
    inject({htmlParser: htmlParserFunction})(
      errors('htmlParser()()')(...actions)
    )


/**
 * Returns the first Element that matches the provided HTML Selector
 * @param htmlSelector
 */
export const $ = (htmlSelector: string, parser?: Function): Action<InjectPage & Partial<InjectHtmlParser>> =>
  async({page, htmlParser}) => {
    parser ??= htmlParser ??= cheerio.load

    const scrapedHTML = await page.evaluate(getElementOuterHTML, htmlSelector)
    return scrapedHTML ? parser(scrapedHTML) : undefined
  }

/**
 * Returns an array of parsed HTML Element's as objects (dependent on the html parser used) that match the provided HTML Selector
 * @param htmlSelector
 */
export const $$ = (htmlSelector: string, parser?: Function): Action<InjectPage & Partial<InjectHtmlParser>> =>
  async({page, htmlParser}) => {
    parser ??= htmlParser ??= cheerio.load

    const scrapedHTMLs = await page.evaluate(getElementsOuterHTML, htmlSelector)
    const cheerioEls = scrapedHTMLs.map(scrapedHTML => parser(scrapedHTML))

    return cheerioEls
  }

/**
 * Evaluate functions inside the `page` context. Run Javascript functions inside Puppeteer Pages as if copying/pasting the code in the Console then running it
 * @param functionToEvaluate
 * @param functionParams
 */
export const evaluate = (functionToEvaluate: EvaluateFn<any>, ...functionParams: any[]): Action<InjectPage> =>
  async({page}) => page.evaluate(functionToEvaluate, ...functionParams)
