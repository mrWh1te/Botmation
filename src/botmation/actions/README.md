# BotAction's Reference

As of v2.0.0, there are 12 types of Bot Actions.

1. [Console](#console)
2. [Cookies](#cookies)
3. [Input](#input)
4. [Navigation](#navigation)
5. [Output](#output)
6. [Utilities](#utilities)

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

  Will type with a "keyboard" the copy provided ie after clicking a form text input `type('text value')`

## Navigation

These higher order functions provide a simple way to navigate URL's.

- `goTo(url: string, goToOptions?: DirectNavigationOptions)`
  
  Navigates the page to the url provided, unless the active url is the url provided, then it emits a warning in the console
  
  Default `goToOptions` are provided, therefore, optional. You can override the defaults with whatever you want, it follows the `DirectNavigationOptions` from the `@types/puppeteer` package
- `waitForNavigation()`

  Simply awaits Puppeteer's Page's `waitForNavigation` async method that can be helpful when navigating Single Page Applications ie filling a form that causes the page to change

## Output

These higher order functions provide simple ways to save things from the Page to the local disk, etc.

- `screenshot(fileName: string)`

  Takes a screenshot of the current page, where ever it's scrolled too, and saves it as a PNG file with the given file name.

  You can change the directory where it's saved by overloading the `BotOptions`.

- `screenshotAll(...urls: string[])`

  Simple Bot Action, for taking a screenshot of multiple site pages. Provide a comma separated list of URL strings ie `screenshotAll('https://google.com', 'https://twitter.com')`. It will create the screenshots in the current active directory, which can be adjusted by overloading `BotOptions`.
  
## Utilities

These higher order functions provide utilities to the programmer in building chains of Bot Action functions. Some of them help devs do regular scripting things, like writing an if statement, or a basic loop. These are fun to play with, can reduce your overall code, keep it more functional, etc.

- `givenThat(condition)(...actions)`

  Takes an async function, similar to a `BotAction` (same parameters so called a `ConditionalBotAction`), but is expected not to change the state of the page, but to return a promise that resolves to a Boolean value (or rejects). If that promise resolves to `TRUE`, only then, will it run the sequence of comma-delimited actions.

  The [example Instagram bot](/src/examples/instagram.ts), uses `givenThat()()`, to attempt login, only if the bot is a Guest on the page.

- `forAll(collection)(callback => BotAction | BotAction[])`

  This Bot Action takes a collection, either an array of any type or a simple json object with key -> value pairs to iterate with a callback function that returns a Bot Action or an array of Bot Action's for the iteratee to run against.

  The [screenshotAll()](/src/botmation/actions/output.ts) Bot Action wraps the `forAll()()` Bot Action, to run `goTo()` and `screenshot()` actions, on the array (collection) of urls provided.

- `doWhile(condition)(...actions)`

  Works like a traditional do while loop. It runs the actions first, then checks the condition as to whether or not it should run the actions again. It will keep running the chain of actions in a loop until the condition resolves `FALSE` or rejects.

  This is experimental Bot Action. If you're looking for example code, the closest is `givenThat()()`.

- `forAsLong(condition)(...actions)`

  Works like a traditional while loop. It checks the condition before running the actions each time. It stops looping if the condition resolves False or rejects.

  This is experimental Bot Action. If you're looking for example code, the closest is `givenThat()()`.

- `wait(milliseconds: number)`

  This Bot Action is not like the others in this group, but a utility for the developer. This pauses execution before next Bot Action in the chain will run, for the time provided.
  
  This Bot Action lacks strong testing, see [Issue #8](/issues/8) for details.