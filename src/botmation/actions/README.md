# BotAction's Reference

As of v2.0.0, there are 12 types of Bot Actions.

1. [Assembly Lines](#assembly-lines)
2. [Console](#console)
3. [Cookies](#cookies)
4. [Errors](#errors)
5. [Files](#files)
6. [IndexedDB](#indexeddb)
7. [Inject](#inject)
8. [Input](#input)
9. [Local Storage](#local-storage)
10. [Navigation](#navigation)
11. [Pipe](#pipe)
12. [Utilities](#utilities)

## Assembly Lines

These higher order functions run and compose Bots. They are a vital part of Botmation.

- `chain(...actions: BotAction[]): BotAction`

  Assembles the declared actions for running in the returned `BotAction`. If the `injects` have a Pipe, the Chain removes it before running the first action.
- `pipe(valueToPipe?: any) => (...actions: BotAction<PipeValue|void>[]): BotAction<any>`

  Assembles the declared actions in the second call in a Pipe and overwrites any potential injected Pipe with a new value wrapped in a Pipe, if a value is given for `valueToPipe`.
- `assemblyLine(forceInPipe: boolean = false) => (...actions: BotAction<any>[]): BotAction<any>`

  Assembles the declared actions in the second call to run in either a Pipe or a Chain, depending on if the Injects have a Pipe (then run in a Chain) or if the `forceInPipe` value is provided as `true` (then run in a Pipe). If there are no Pipe values, that is considered an empty Pipe.
- `pipeActionOrActions(actionOrActions: BotAction<PipeValue> | BotAction<PipeValue>[]): BotAction<PipeValue|undefined>`

  This is a unique kind of Pipe for special cases when you don't know if you're given an array of `BotAction`'s or just one `BotAction` that is different than the typical spread array of `BotAction`'s. One of the "Utilities" uses this in support of the closure function.

## Console

These higher order functions provide a simple way to log messages, warnings, and errors, with a clear colorful syntax in the NodeJS terminal.

- `log(message: string): BotAction`

  Logs a clear green message to the Console. If there is a Pipe, it will log the value too and return the Pipe value to pass it on.
- `warning(warning: string): BotAction`

  Logs a orange warning message to the Console. If there is a Pipe, it will log the value too and return the Pipe value to pass it on.
- `error(error: string): BotAction`

  Logs a red error message to the Console. If there is a Pipe, it will log the value too and return the Pipe value to pass it on.

## Cookies

These higher order functions provide a simple way to load and save cookies from and to a Puppeteer page.

You can configure where the cookie JSON files are saved/loaded by using `BotOptions` as an inject or as a higher-order param. Higher-order param values override injected ones.

Also, these functions are compatible with the higher-order `files()()` `BotAction` to configure the URL's for files during assembly for the declared actions.

- `saveCookies(fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction`

  Saves the cookies from the Puppeteer page in a JSON file with the name provided

- `loadCookies(fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction`

  Loads the cookies from the file specified into the Puppeteer page

## Errors

This single `BotAction` provides a way to catch thrown errors in assembled `BotAction`'s. 

- `errors(errorsBlockName: string = 'Unnamed Errors Block') => (...actions: BotAction<PipeValue|void>[]): BotAction<any>`

  Log any caught error in the assembled actions with the `errorsBlockName`. After an error is caught, the remaining unran actions are ignored, but the higher order assembly line where the `errors()()` was used, continues, unaffected.

## Files

These focus on building and saving files to the local disk like taking a screenshot of the current window or generating a PDF of the whole page.

These functions, and the Cookies' actions, are all compatible with the higher-order `files()()` `BotAction` to customize the `injects` of the `BotFileOptions` for all assembled actions. The `BotFilesAction` interface types the `injects` expected when assembled inside `files()()`.

- `screenshot(fileName: string): BotFilesAction`

  Takes a screenshot of the current page, where ever it's scrolled too, and saves it as a PNG file with the given file name.

  You can change the directory where it's saved by overloading the `BotOptions`.

- `screenshotAll(...urls: string[]): BotFilesAction`

  Simple Bot Action, for taking a screenshot of multiple site pages. Provide a comma separated list of URL strings ie `screenshotAll('https://google.com', 'https://twitter.com')`. It will create the screenshots in the current active directory, which can be adjusted by overloading `BotOptions`.

- `savePDF(fileName: string, botFileOptions?: Partial<BotFileOptions>): BotFilesAction`

  Simple Bot Action, for taking a screenshot of multiple site pages. Provide a comma separated list of URL strings ie `screenshotAll('https://google.com', 'https://twitter.com')`. It will create the screenshots in the current active directory, which can be adjusted by overloading `BotOptions`.

## IndexedDB

These focus on interacting with the Page's local IndexedDB.

- `setIndexedDBValue(key?: string, value?: any, storeName?: string, databaseName?: string, databaseVersion?: number): BotIndexedDBAction<void>`

  Sets a `key` in one IndexedDB Store with the provided value. Supports Piping the `key` and `value` in an object ie `{key: 'some-key', value: 'some-value'}`, and injecting the Database name, version (optional), and store name. Higher order params override injected ones.

- `getIndexedDBValue(key?: string, storeName?: string, databaseName?: string, databaseVersion?: number): BotIndexedDBAction<PipeValue>`

  Gets a value by `key` in one IndexedDB Store. Supports Piping the `key` as a Pipe value or in an object ie `{key: 'some-key'}`, and injecting: the Database name, version (optional), and store name. Higher order params override injected ones.

- `indexedDBStore(databaseName: string, storeName: string, databaseVersion?: number) => (...actions: BotAction<PipeValue|void>[]): BotAction<any>`

  Sets the first few `injects` for IndexedDB `BotAction`'s (the two above). This makes it easy to operate within one DB Store, while specifying the store name, database name, and database version once as those values are injected for expecting `BotAction`'s.

## Inject

A highly composable `BotAction` for setting the first few `injects` in a new line of actions while appending the higher order `injects` at the end.

- `inject(...newInjects: any[]) => (...actions: BotAction<PipeValue|void>[]): BotAction<any>`

  Can be used to compose higher-order injecting assembly-line functions like `files()()` and `indexedDBStore()()`.

## Input

These higher order functions provide a simple way to click elements in the page or type with a keyboard.

- `click(selector: string): BotAction`
  
  Does a left-mouse click on the HTML element, given the selector provided ie `click('form input[type="submit"]')`
- `type(copy: string): BotAction`

  Will type with a "keyboard" the copy provided ie after clicking a form text input `type('text value')`

## Local Storage

These focus on interacting with the Page's Local Storage.

- `clearAllLocalStorage: BotAction`
  
  Clears all key/value pairs in Local Storage
- `removeLocalStorageItem(key?: string): BotAction`
  
  Removes one key/value pair from Local Storage based on the key provided through the higher-order params or Pipe. The key can be passed in as the Pipe's value or as the Pipe's value wrapped object ie `{key: 'some-key'}`.
- `setLocalStorageItem(key?: string, value?: string): BotAction`
  
  Sets one key/value pair in Local Storage by the key provided. Both the key and value can be passed in through a mixture of higher-order params and Pipe values. Higher-order params override injected values, including Pipe. The Pipe value can be value you want to set directly, or an object for the key and/or value ie `{key: 'some-key', value: 'some-value'}`.

- `getLocalStorageItem(key?: string): BotAction<string|null>`
  
  Gets the value of one item from Local Storage by key. If the key does not exist, it returns `null`, just like Local Storage. The key can be Piped in as the Pipe's value or an object wrapped key ie `{key: 'some-key'}`.

## Navigation

These higher order functions provide simple ways to change the Page's URL.

- `goTo(url: string, goToOptions?: DirectNavigationOptions): BotAction`
  
  Navigates the page to the url provided, unless the active url is the url provided, then it emits a warning in the console
  
  Default `goToOptions` are provided, therefore, optional. You can override the defaults with whatever you want, it follows the `DirectNavigationOptions` from the `@types/puppeteer` package
- `goBack(options?: NavigationOptions): BotAction`

  Similar to hitting the browser's "Back" button, to load the previous URL.
- `goForward(options?: NavigationOptions): BotAction`
  
  Similar to hitting the brower's "Forward" button, to go forward after going back.
- `reload(options?: NavigationOptions): BotAction`

  Similar to hitting the brower's "Refresh" button, to reload the page with the same URL.
- `waitForNavigation: BotAction`

  Simply awaits Puppeteer's Page's `waitForNavigation` async method that can be helpful when navigating Single Page Applications ie filling a form that causes the page to change

## Pipe

These focus on piping.

- `map<R extends PipeValue = PipeValue>(mapFunction: (pipedValue: PipeValue) => R): BotAction<R>`

  Map accepts a pure function to run against the Pipe's value. If you need to cast the Pipe's value, map it from one type to another, you can do so simply with `map()`.
- `pipeValue<R extends PipeValue = PipeValue>(valueToPipe: R|undefined): BotAction<R|undefined>`
  
  This can be used to set the Pipe value for the next `BotAction` in an Assembly Line. 
- `emptyPipe: BotAction`

  This `BotAction` simply returns `undefined` which empties the Pipe. An empty Pipe is one that `value` is `undefined`.

## Utilities

These higher order functions provide utilities to building Assembly Lines with multiple branching logic. From writing an if statement, to a basic for loop. These functions are both fun to play with and can reduce your overall code, while keeping it all declaratively functional.

The higher-order functions run the assembled actions in a Pipe.

- `givenThat(condition: ConditionalBotAction) => (...actions: BotAction<any>[]): BotAction`

  Takes an async function, similar to a `BotAction` (same parameters but called a `ConditionalBotAction`) that is expected to return a promise that resolves to a Boolean value. If that promise resolves to `TRUE`, only then, will it run the assembled actions.

  The [example Instagram bot](/src/examples/instagram.ts), uses `givenThat()()`, to attempt login, only if the bot is a Guest on the page then only operates as a logged in User, after checking if the bot is logged in on the page.

- `forAll(collection: any[] | Dictionary) => (botActionOrActionsFactory: (...args: any[]) => BotAction<any>[] | BotAction<any>): BotAction`

  This `BotAction` takes a collection, either an array of any type or a simple json object with key/value pairs to iterate with a callback function that returns a Bot Action or an array of Bot Action's to iterate against.

  The [screenshotAll()](/src/botmation/actions/output.ts) Bot Action wraps the `forAll()()` Bot Action, to run `goTo()` and `screenshot()` actions, on a collection of urls provided.

- `doWhile(condition)(...actions)`

  Works like a traditional do while loop. It runs the actions first, then checks the condition as to whether or not it should run the actions again. It will keep running the chain of actions in a loop until the condition resolves `FALSE` or rejects.

- `forAsLong(condition)(...actions)`

  Works like a traditional while loop. It checks the condition before running the actions each time. It stops looping if the condition resolves False or rejects.

- `wait(milliseconds: number)`

  This Bot Action is not like the others in this group, but a utility for the developer. This pauses execution before next Bot Action in the chain will run, for the time provided.