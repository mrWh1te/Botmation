/**
 * BotAction's dedicated to scraping web pages
 */

import * as cheerio from 'cheerio'

import { BotAction, ScraperBotAction } from '../interfaces/bot-actions'

import { inject } from '../actions/inject'
import { errors } from '../actions/errors'
import { getElementOuterHTML, getElementsOuterHTML } from '../helpers/scrapers'
import { unpipeInjects } from '../helpers/pipe'
import { pipe } from './assembly-lines'
import { logMessage } from 'botmation/helpers/console'

/**
 * @description   Inject htmlParser for ScraperBotAction's
 *                
 * @param htmlParser 
 */
export const htmlParser = (htmlParser: Function) =>
  (...actions: BotAction[]): BotAction => 
    pipe()(
      inject(htmlParser)(
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
    return parser(scrapedHTML)
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

