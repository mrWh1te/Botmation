/**
 * BotAction's dedicated to scraping web pages
 */

import { EvaluateFn } from 'puppeteer'
import * as cheerio from 'cheerio'

import { BotAction, ConditionalBotAction, ScraperBotAction } from '../interfaces/bot-actions'

import { inject } from '../actions/inject'
import { errors } from '../actions/errors'
import { elementExistsInDocument, getElementOuterHTML, getElementsOuterHTML, textExistsInDocument } from '../helpers/scrapers'
import { unpipeInjects } from '../helpers/pipe'
import { pipe } from './assembly-lines'

/**
 * A ConditionalBotAction to return a Boolean value
 *    True if element is found, false if element is not found
 * @param elementSelector
 */
export const elementExists = (elementSelector: string): ConditionalBotAction =>
evaluate(elementExistsInDocument, elementSelector)

/**
 *
 * @param text
 */
export const textExists = (text: string): ConditionalBotAction =>
evaluate(textExistsInDocument, text)

/**
 * @description   Inject htmlParser for ScraperBotAction's
 *
 * @param htmlParserFunction
 */
export const htmlParser = (htmlParserFunction: Function) =>
  (...actions: BotAction[]): BotAction =>
    pipe()(
      inject(htmlParserFunction)(
        errors('htmlParser()()')(...actions)
      )
    )

/**
 * Returns the first Element that matches the provided HTML Selector
 * @param htmlSelector
 */
export const $ = <R = CheerioStatic>(htmlSelector: string, higherOrderHTMLParser?: Function): ScraperBotAction<R> =>
  async(page, ...injects) => {
    let parser: Function

    // Future support piping the HTML selector with higher-order overriding
    const [,injectedHTMLParser] = unpipeInjects(injects, 1)

    if (higherOrderHTMLParser) {
      parser = higherOrderHTMLParser
    } else {
      if (injectedHTMLParser) {
        parser = injectedHTMLParser
      } else {
        parser = cheerio.load
      }
    }

    const scrapedHTML = await page.evaluate(getElementOuterHTML, htmlSelector)
    return scrapedHTML ? parser(scrapedHTML) : undefined
  }

/**
 * Returns an array of parsed HTML Element's as objects (dependent on the html parser used) that match the provided HTML Selector
 * @param htmlSelector
 */
export const $$ = <R = CheerioStatic[]>(htmlSelector: string, higherOrderHTMLParser?: Function): ScraperBotAction<R> =>
  async(page, ...injects) => {
    let parser: Function

    // Future support piping the HTML selector with higher-order overriding
    const [,injectedHTMLParser] = unpipeInjects(injects, 1)

    if (higherOrderHTMLParser) {
      parser = higherOrderHTMLParser
    } else {
      if (injectedHTMLParser) {
        parser = injectedHTMLParser
      } else {
        parser = cheerio.load
      }
    }

    const scrapedHTMLs = await page.evaluate(getElementsOuterHTML, htmlSelector)
    const cheerioEls: CheerioStatic[] = scrapedHTMLs.map(scrapedHTML => parser(scrapedHTML))

    return cheerioEls as any as R
  }

/**
 * Evaluate functions inside the `page` context. Run Javascript functions inside Puppeteer Pages as if copying/pasting the code in the Console then running it
 * @param functionToEvaluate
 * @param functionParams
 */
export const evaluate = (functionToEvaluate: EvaluateFn<any>, ...functionParams: any[]): BotAction<any> =>
  async(page) => page.evaluate(functionToEvaluate, ...functionParams)
