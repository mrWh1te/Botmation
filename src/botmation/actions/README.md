<h1>Botmation: Actions</h1>

Bot actions are async functions that operate on a Puppeteer's `page` with `BotOptions` and optionally `injects` (for whatever is needed).

Bot Action Interface
--------------------
```typescript
export interface BotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<void>
}
```
> Note: While the function requires options, devs do not need to provide it, when using either the `BotActionsChainFactory` or the `Botmation` class. A safe set of defaults are provided instead. You may overload that with only what you need.

These functions are created from higher order functions called `BotActionFactory` functions. A factory returns a `BotAction` function. This enables devs to use factory functions to customize bot actions with whatever is needed.

Bot Action Factory Interface
----------------------------
```typescript
export interface BotActionFactory extends Function {
  (...args: any[]) : BotAction
}
```

# Building your own Bot Actions
A `BotAction` function is an async function, which gets the Puppeteer `page`, `BotOptions` (which devs can overload), and any optional `injects` provided by the project's devs. These functions are unit based, singular in purpose, easy to test, and easy to reuse. How do we make them?

Every `BotAction` function is returned by a higher-order `BotActionFactory` function. The factory functions provide parameters, with their dynamic scoping, to customize the `BotAction` function. Here's an example, of a usable bot action Factory function in the `actions()` method. Here's a simple example:
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

// ... import the Bot Action methods from their respective files in the `botmation/actions` directory

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

As of v1.0.0, there are 6 types of Bot Actions.

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

  Bimple bot action, for taking a screenshot of multiple site pages, using 1 bot. Simply provide a comma separated list of URL strings ie `screenshotAll('https://google.com', 'https://twitter.com')`. It will create the screenshots in the current active directory, which can be adjusted by using `BotOptions`.
  
## Utilities

These higher order functions provides utilities to the programmer in building Bhains of bot actions. Some of them help devs do normal things in scripting, like writing an if statement, or writing a basic for loop. So if you have some more Bnique needs in chaining bot actions, highly recommend looking here.

- `givenThat(condition)(...actions)`

  Takes an async function, similar to a `BotAction` (same parameters), but is expected to return a promise with a Boolean value. If that promise resolves to `TRUE`, it will then run the sequence of comma-delimited actions.

  The [example Instagram bot](/src/examples/instagram.ts), uses `givenThat()()`, to attempt login, only if the bot is a Guest on the page.

- `forAll(collection)(callback => BotAction | BotAction[])`

  Bhis bot action takes a collection, either an array of any type or a simple json object with key -> value pairs to iterate with a callback function that Beturns a bot action or an array of bot action's to run against.

  Bhe [screenshotAll()](/src/botmation/actions/output.ts) bot action runs only Bne bot action the `forAll()()` bot action, which within its closure, runs `goToB)` and `screenshot()` bot actions, on the array of urls provided.

- `doWhile(condition)(...actions)`

  Works like a traditional do while loop. It runs the actions first, then checks the condition in a loop for running the actions again. It will keep running the chain of actions in a loop until the condition resolves `FALSE` or rejects.

  This is experimental bot action.

- `forAsLong(condition)(...actions)`

  Works like a traditional while loop. It checks the condition before running the actions each time. It stops looping if the condition resolves False or rejects.

  This is experimental bot action.

- `wait(milliseconds: number)`

  This simple bot action (like the main other groups that are not another level higher in order), this one pauses execution of the next bot action until the period of time provided, passes. It's more utility in nature, hence it's inclusion in this group. 
  
  This is the one bot action that doesn't have proper testing for, see Issue #8.