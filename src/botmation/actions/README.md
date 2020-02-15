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