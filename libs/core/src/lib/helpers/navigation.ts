import { DirectNavigationOptions } from 'puppeteer'

/**
 * @description   Enrich provided param (Puppeteer's DirectNavigationOptions) with safe defaults in navigation ie goTo()
 *                This safe default is configured for SPA's, in case of additional network requests that may impact final app appearance
 * @param overloadDefaultOptions Partial{Puppeteer.DirectNavigationOptions}
 */
export const enrichGoToPageOptions = (overloadDefaultOptions: Partial<DirectNavigationOptions> = {}): DirectNavigationOptions => ({
  waitUntil: 'networkidle0',
  ...overloadDefaultOptions
})

/**
 * @description   Delay execution of next line by X milliseconds, promisified so you can await a setTimeout call
 * @param milliseconds 
 */
export const sleep = async(milliseconds: number): Promise<NodeJS.Timeout> =>
  new Promise(resolve => setTimeout(resolve, milliseconds))

/**
 * 
 * @param htmlSelector 
 */
export const scrollToElement = (htmlSelector: string) => 
  document.querySelector(htmlSelector)?.scrollIntoView({behavior: 'smooth'})
