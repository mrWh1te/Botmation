/**
 * Returns an escaped string representation of the HTML for the given html selector. Includes children elements.
 * @param htmlSelector
 */
/* istanbul ignore next */
export const getElementOuterHTML = (htmlSelector: string): string|undefined =>
  document.querySelector(htmlSelector)?.outerHTML

/**
 * Returns an array of escaped string representations of HTML code matching the given html selector. Includes children elements.
 * @param htmlSelector
 */
/* istanbul ignore next */
export const getElementsOuterHTML = (htmlSelector: string): string[] =>
  Array.from(document.querySelectorAll(htmlSelector)).map(el => el.outerHTML)

/**
 *
 * @param htmlSelector
 */
export const elementExistsInDocument = (htmlSelector: string): boolean =>
  document.querySelector(htmlSelector) !== null

/**
 * Check the DOM for text. If found, return TRUE, otherwise return FALSE
 * @param text
 */
export const textExistsInDocument = (text: string): boolean =>
  ( document.documentElement.textContent || document.documentElement.innerText )
    .indexOf(text) > -1

