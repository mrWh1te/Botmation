
/**
 *
 * @param text
 */
export const clickElementWithText = (text: string) => {
  const xpath = `//*[text()='${text}']`
  const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  if (matchingElement instanceof HTMLElement) {
    matchingElement.click()
  }
}
