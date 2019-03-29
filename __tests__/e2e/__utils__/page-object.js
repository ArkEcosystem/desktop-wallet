/**
 * This class should be inherited to make use of the pageobject pattern, although
 * in the version 4 of Webdriver is not very useful (http://v4.webdriver.io/api.html).
 * That will change on version 5.
 */
export default class PageObject {
  constructor (browser) {
    this.__browser = browser
  }

  $ (selector) {
    return this.__browser.$(selector)
  }

  $$ (selector) {
    return this.__browser.$$(selector)
  }
}
