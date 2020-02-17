<h1>Botmation: Actions</h1>

Bot Actions are async functions that operate on a Puppeteer's `page` with `BotOptions` and optionally `injects` (for whatever is needed).

Bot Action Interface
--------------------
```typescript
export interface BotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<void>
}
```
> Note: While the function requires options, devs do not need to provide it, when using either the `BotActionsChainFactory` or the `Botmation` class. A safe set of defaults are provided instead. You may overload that with only what you need.

These functions are created from higher order functions called `BotActionFactory` functions. A factory returns a `BotAction` function. This enables devs to use factory functions to customize Bot Actions with whatever is needed.

Bot Action Factory Interface
----------------------------
```typescript
export interface BotActionFactory extends Function {
  (...args: any[]) : BotAction
}
```

# Building your own Bot Actions
A `BotAction` function is an async function, which gets the Puppeteer `page`, `BotOptions` (which devs can overload), and any optional `injects` provided by the project's devs. These functions are unit based, singular in purpose, easy to test, and easy to reuse. How do we make them?

Every `BotAction` function is returned by a higher-order `BotActionFactory` function. The factory functions provide parameters, with their dynamic scoping, to customize the `BotAction` function. Here's an example, of a usable Bot Action Factory function in the `actions()` method. Here's a simple example:
```typescript
export const clickHTMLElementBySelector = (htmlSelector: string): BotAction => async(page: Page) => {
  await page.click(htmlSelector)
}
```
Since we are not using the Bot `options` or any `injects`, we don't need to include them in the function's parameters.

That is a great example of reusable unit of a `BotAction`, something single purpose, is more easily reused. Now let's take a step back, and group some of these units into one easy to use `BotAction`. It is possible to reuse any other `BotAction` functions, in a single `BotAction` function, by reusing  the `BotActionsChainFactory` function. See, you can make chains of `BotAction` functions, this way, to call them, one by one. A great example, is the Instagram specific [login()](/src/botmation/bots/instagram/actions/auth.ts) `BotAction` that uses `goTo()`, `click()`, and `type()` to handle a login flow.

Here's an example:
```typescript
import { Page } from 'puppeteer' // @types/puppeteer
import { BotActionsChainFactory } from 'botmation'
import { BotAction } from 'botmation/interfaces'

// ... import the Bot Action Factory methods from their respective files in the `botmation/actions` directory

export const loginExampleFlow = (username: string, password: string): BotAction => async(page: Page, options, ...injects) =>
  // This is how a single BotAction can run its own sequence of BotAction's prior to the next call of the original bot.actions() sequence
  BotActionsChainFactory(page, options, ...injects)(
    goTo('http://example.com/login.html'),
    click('form input[name="username"]'),
    type(username),
    click('form input[name="password"]'),
    type(password),
    click('form button[type="submit"]'),
    waitForNavigation(),
    log('Login Complete')
  )
```


# Actions Reference

As of v1.0.0, there are 6 types of bot actions.

1. Console
2. Cookies
3. Input
4. Navigation
5. Output
6. Utilities

## Console

These higher order functions provide a simple way to log messages, warnings, and errors, with a clear colorful syntax in the NodeJS terminal.

- `log(message: string)`

  Logs a clear green message to the Console
- `warning(warning: string)`

  Logs a orange warning message to the Console
- `error(error: string)`

  Logs a red error message to the Console

## Cookies

These higher order functions provide a simple way to load and save cookies from and to a Puppeteer page.

You can configure where the cookie JSON files are saved/loaded by using `BotOptions`. Both the class, and the factory, support it.

- `saveCookies(fileName: string)`

  Saves the cookies from the Puppeteer page in a JSON file with the name provided

- `loadCookies(fileName: string)`

  Loads the cookies from the file specified into the Puppeteer page

## Input

These higher order functions provide a simple way to click elements in the page or type with a keyboard.

- `click(selector: string)`
  
  Does a left-mouse click on the HTML element, given the selector provided ie `click('form input[type="submit"]')`
- `type(copy: string)`

  Performs typing with a virtual keyboard, given the copy provided. It's helpful to click something that you can type in, before running this Bot Action

## Navigation

These higher order functions provide a simple way to navigate URL's.

- `goTo(url: string, goToOptions?: DirectNavigationOptions)`
  
  Navigates the page to the url provided, unless the active url is the url provided, then it emits a warning in the console
  
  Default `goToOptions` are provided, therefore, optional. You can override the defaults with whatever you want, it follows the `DirectNavigationOptions` from the `@types/puppeteer` package
- `waitForNavigation()`

  Simple awaits Puppeteer's Page's `waitForNavigation()` async method that can be helpful when navigating Single Page Applications.

## Output

These higher order functions provide simple ways to save things from the Page to the local disk, etc.

- `screenshot(fileName: string)`

  Takes a screenshot of the current page, where ever it's scrolled too, and saves it as a PNG file with the given file name.

  You can change the directory where it's saved by overloading the `BotOptions`.

- `screenshotAll(...urls: string[])`

  Simple Bot Action, for taking a screenshot of multiple site pages, using 1 bot. Simply provide a comma separated list of URL strings ie `screenshotAll('https://google.com', 'https://twitter.com')`. It will create the screenshots in the current active directory, which can be adjusted by using `BotOptions`.
  
## Utilities