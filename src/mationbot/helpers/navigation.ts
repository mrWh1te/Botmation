import { DirectNavigationOptions } from 'puppeteer'

/**
 * Helpers for the Page object from Puppeteer
 */

/**
 * @description   This provides the default options object for the Puppeteer's Page object's goto() method
 *                Particularly configured to work with Instagram's SPA, with the option to overload as needed
 * @param overloadDefaultOptions 
 */
export const getDefaultGoToPageOptions = (overloadDefaultOptions: DirectNavigationOptions = {}): DirectNavigationOptions => ({
  waitUntil: 'networkidle0',
  ...overloadDefaultOptions
})