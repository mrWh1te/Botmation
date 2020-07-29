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