<h1>Botmation: Actions</h1>

Bot Actions are async functions that do singular tasks. They are given the Puppeteer's `page`, the current `BotOptions` and any optional `injects` by the `Botmation` class or through the purely functional approach.

Bot Action Interface
--------------------
```typescript
interface BotAction extends Function {
  (page: Page, options: BotOptions, ...injects: any[]) : Promise<void>
}
```
> Note: While the function requires options, you do not need to provide any, since the `BotActionsChainFactory`, which is where these actions are called, will provide a safe set of default values for `options`. You may overload it through the `BotActionsChainFactory` call functionally or with a `Botmation` class constructor method or option mutator methods.

These functions are mostly created from higher order functions called `BotActionFactory` functions. They each return a `BotAction` function. This enables devs to use higher order functions to provide customization for their Bot Actions.

Bot Action Factory Interface
----------------------------
```typescript
interface BotActionFactory extends Function {
  (...args: any[]) : BotAction
}
```

# Building your own Bot Actions
Most `BotAction` functions are returned by their higher-order `BotActionFactory` functions. These higher order functions provide parameters, with their dynamic scoping, to customize their `BotAction` function. Here's an example, of a complete Bot Action with its Factory function that customizes the effect:
```typescript
// Higher Order BotActionFactory Function
export const click = (htmlSelector: string): BotAction =>
  // Returns an async BotAction Function
  async(page: Page) => {
    await page.click(htmlSelector) // use higher order params to customize
  }
```
> Note: Since we are not using the Bot `options` or any `injects` in the `BotAction`, we don't need to include them in the `BotAction` function's parameters.

It's a perfect example of a single purpose, reusable `BotAction` function. It's style is the foundational level of building blocks that a `BotAction` can be. It directly uses Puppeteer code from the `page` instance. It does something specific, singular.

### BotAction Wraps Another BotAction
Given the utility functions, you may find yourself wanting to write simple BotAction's that wraps one other `BotAction`. One example of which is the Output Bot Action [screenshotAll()](/src/botmation/actions/output.ts):
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
    )(page, options) // second function call to provide the page, and optional options & injects
```
In this case, you have to call the `BotAction` through its Factory function. 

### BotAction Wraps a Chain of BotAction's
Now let's take a step back, and group any of these `BotAction` functions into one reusable `BotAction` function. It is possible for one `BotAction` to represent a chain of `BotAction` functions that must complete before the next `BotAction` runs, in its chain. By using the `BotActionsChainFactory` function, we can create a `BotAction` that runs a chain of `BotAction` functions, in order declared. One example is the Instagram specific [login()](/src/botmation/bots/instagram/actions/auth.ts) `BotAction` that chains `goTo()`, `click()`, and `type()` to handle a login flow:
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
Now this works because the return type of `BotActionsChainFactory` inner function call and the return type of `BotAction` are both `Promise<void>`, so we can handle them the same way, and so happenly, in another `BotActionsChainFactory` call, the main one.

### BotAction Chain Nesting
Bot Action functions, like any of the above, are each links in the chain, ran linearly. It's a chain of resolving promises. Therefore, you can nest chains inside chains, and as deeply as you want, in theory. One of the [tests](/src/tests/botmation/factories/bot-actions-chain.factory.spec.ts) verifies this to one level of nesting. This is something to be explored, but probably best to avoid deep levels of nesting.

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

  Will type with a "keyboard" the copy provided ie after clicking a form text input `type('text value')`

## Navigation

These higher order functions provide a simple way to navigate URL's.

- `goTo(url: string, goToOptions?: DirectNavigationOptions)`
  
  Navigates the page to the url provided, unless the active url is the url provided, then it emits a warning in the console
  
  Default `goToOptions` are provided, therefore, optional. You can override the defaults with whatever you want, it follows the `DirectNavigationOptions` from the `@types/puppeteer` package
- `waitForNavigation()`

  Simply awaits Puppeteer's Page's `waitForNavigation()` async method that can be helpful when navigating Single Page Applications ie filling a form that causes the page to change

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