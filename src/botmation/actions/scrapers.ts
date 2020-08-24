/**
 * BotAction's dedicated to scraping web pages
 */

import * as cheerio from 'cheerio'

import { BotAction, ScraperBotAction } from '../interfaces/bot-actions'

import { inject } from '../actions/inject'
import { errors } from '../actions/errors'
import { getElementOuterHTML, getElementsOuterHTML } from '../helpers/scrapers'
import { pipe } from './assembly-lines'

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
  async(page, injectedHTMLParser) => {
    let parser: Function

    if (!higherOrderHTMLParser) {
      if (injectedHTMLParser) {
        parser = injectedHTMLParser
      } else {
        parser = cheerio.load
      }
    } else {
      parser = higherOrderHTMLParser
    }

    const scrapedHTML = await page.evaluate(getElementOuterHTML, htmlSelector)
    return parser(scrapedHTML)
  }
  
/**
 * Returns an array of parsed HTML Element's as objects (dependent on the html parser used) that match the provided HTML Selector
 * @param htmlSelector 
 */
export const $$ = <R = CheerioStatic[]>(htmlSelector: string, higherOrderHTMLParser?: Function): ScraperBotAction<R> => 
  async(page, injectedHTMLParser) => {
    let parser: Function

    if (!higherOrderHTMLParser) {
      if (injectedHTMLParser) {
        parser = injectedHTMLParser
      } else {
        parser = cheerio.load
      }
    } else {
      parser = higherOrderHTMLParser
    }

    const scrapedHTMLs = await page.evaluate(getElementsOuterHTML, htmlSelector)
    return scrapedHTMLs.map(scrapedHTML => parser(scrapedHTML)) as any as R
  }

