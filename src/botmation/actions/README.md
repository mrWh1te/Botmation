<h1>Botmation: Actions</h1>

Bot Actions are async functions, each doing a single thing. They are given the Puppeteer's `page`, the current `BotOptions` and any optional `injects`.

Bot Action Interface
--------------------
```typescript
export interface BotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<void>
}
```
> Note: While the function requires options, you do not need to provide any, since the `BotActionsChainFactory`, which is where these actions are called, will provide a safe set of default values for `options`. You may overload it through the `BotActionsChainFactory` or with a `Botmation` class method.

These functions are created from higher order functions called `BotActionFactory` functions. They each return a `BotAction` function. This enables devs to use higher order functions to provide customization to their Bot Actions.

Bot Action Factory Interface
----------------------------
```typescript
export interface BotActionFactory extends Function {
  (...args: any[]) : BotAction
}
```

# Building your own Bot Actions
A `BotAction` function is an async function, which is provided the Puppeteer `page`, a safe set of `BotOptions` values (which devs can overload), and any optional `injects` added by you. These functions are single focused, easy to test, and easy to use. How do we make them?

Most `BotAction` functions are returned by their higher-order `BotActionFactory` functions. These higher order functions provide parameters, with their dynamic scoping, to customize their `BotAction` function. Here's an example, of a complete Bot Action with its Factory function that customizes the effect of its `BotAction`:
```typescript
// Higher Order BotActionFactory Function
export const click = (htmlSelector: string): BotAction =>
  // Returns an async BotAction Function
  async(page: Page) => {
    await page.click(htmlSelector) // use higher order params to customize
  }
```
> Note: Since we are not using the Bot `options` or any `injects` in the `BotAction`, we don't need to include them in the higher order function's parameters.

That is a great example of a single purpose, reusable `BotAction` function. It's the foundational level of building blocks that a `BotAction` can be. It directly uses Puppeteer code from the `page` instance. There are no other `BotAction` functions, but it's possible, and pragamtic at times, to have a `BotAction` wrap one other `BotAction` or a chain of `BotAction` functions.

### BotAction Wraps One BotAction
Given the utility functions, you may find yourself writing simple BotAction's to wrap units of functionality in a reusable way. One example of which is the Output Bot Action [screenshotAll](/src/botmation/actions/output.ts):
```typescript
// Factory Function for a list of url's
export const screenshotAll = (...urls: string[]): BotAction => 
  async(page: Page, options) =>
    // calling the Bot Action's Factory Function
    await forAll(urls)(
      (url) => ([
        goTo(url),
        screenshot(url.replace(/[^a-zA-Z]/g, '_'))
      ])
    )(page, options) // by calling it twice to provide the page, and optionally options & injects
```
You have to call the BotAction through its Factory function. Since `BotAction` functions are `async`, you have to `await` the call. A function call, inside a function call resolving the higher order function down to the returned function to call in one go.

### BotAction Wraps a Chain of BotAction's
Now let's take a step back, and group any of these `BotAction` functions into a single reusable chain of a `BotAction` function. It is possible for one `BotAction` to represent another chain of `BotAction` functions that must complete before the next `BotAction` runs. By using the `BotActionsChainFactory` function, we can create a `BotAction` that runs a chain of `BotAction` functions, in order, one by one. One example is the Instagram specific [login()](/src/botmation/bots/instagram/actions/auth.ts) `BotAction` that chains `goTo()`, `click()`, and `type()` to handle a login flow:
```typescript
export const login = ({username, password}: {username: string, password: string}): BotAction => 
  async(page: Page, options, ...injects) =>
    // This is how a single BotAction can run its own sequence of BotAction's prior to the next call of the original bot.actions() sequence
    BotActionsChainFactory(page, options, ...injects)(
      goTo(getInstagramLoginUrl()),
      click(FORM_AUTH_USERNAME_INPUT_SELECTOR),
      type(username),
      click(FORM_AUTH_PASSWORD_INPUT_SELECTOR),
      type(password),
      click(FORM_AUTH_SUBMIT_BUTTON_SELECTOR),
      waitForNavigation(),
      log('Login Complete')
    )
```
Now this works because the return type of `BotActionsChainFactory` inner function call and the return type of `BotAction` are both `Promise<void>`, so we can handle them the same way, so happenly, in another `BotActionsChainFactory` call, the main one.

### BotAction Chain Nesting
Bot Action functions, like any of the above, are each links in the chain, ran one by one. It's a chain of promises. Therefore, you can nest chains inside chains, as deeply as you want. One of the [tests](/src/tests/botmation/botmation.wrappers.spec.ts), verifies this to 1 level of nesting. This is something to be explored upon, but probably best to avoid deep levels of nesting.

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