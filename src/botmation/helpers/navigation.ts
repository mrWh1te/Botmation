import { DirectNavigationOptions } from 'puppeteer'

/**
 * @description   This provides the default safe options' values for the Puppeteer's Page object's goto() method
 *                Particularly configured to work with SPA's, but has the option to overload as needed
 * @param overloadDefaultOptions 
 */
export const getDefaultGoToPageOptions = (overloadDefaultOptions: DirectNavigationOptions = {}): DirectNavigationOptions => ({
  waitUntil: 'networkidle0',
  ...overloadDefaultOptions
})