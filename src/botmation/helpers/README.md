<h1>Botmation: Helpers</h1>

Helpers are de-coupled functions to help in various tasks.

# Helpers Reference

As of v1.0.0, there are 8 types of helpers.

1. Actions
2. Assets
3. BotOptions
4. Console
5. Files
6. Navigation
7. Utilities

## Actions

These helper methods help with dealing with bot actions.

- async applyBotActionOrActions(page: Page, options: BotOptions, actions: BotAction[] | BotAction, ...injects: any[])
It's an effective way to run bot actions when you're not sure if they are an array of bot actions or not an array, but just one single bot action.

## Assets

These helper methods deal with the output bot actions, and help out with managing assets.

- createFolderURL(...folderNames: string[])
It focuses on prepending URL's for a relative structure from the root directory. It will not leave a trailing backslash. So you can include filename at the end for a full relative URL.

## BotOptions

This is our loosely coupled bot options helper functions for dealing with the `options` of class `Botmation`, and if you're skipping that, the Bot Actions Chain Factory. The strategy behind the `options` is that they are optional, given that have safe defaults for all the bot actions that rely on data from `options`. So in creating an object instance, or using the Functional approach, you don't need to provide options, but if you do, you only need to provide what you want to change from the safe default values.

- getDefaultBotOptions(options: Partial<BotOptions>)
This is used when providing `options` for bot actions with safe defaults.

## Console

The higher order Console Bot Actions  use these functions, so if you want to use the colorful logging messages outside a chain of actions, you can use these methods directly:

- logMessage(message: string)
Logs a clear green message to the Console

- logWarning(warning: string)
Logs a orange warning message to the Console

- logError(error: string)
Logs a red error message to the Console

## Files

These helper functions facilitate in the management of files. Asset management may build on these functions. They are used in testing, to help clean up tests.

- async fileExist(filePath: string)
Returns a promise that resolves TRUE or FALSE

- async deleteFile(filePath: string)
Resolves or rejects on success or failure

## Navigation

These helper functions deal with the defaults in using Puppeteer's navigational methods.

- getDefaultGoToPageOptions(overloadDefaultOptions: DirectNavigationOptions = {})
The `goTo()` bot action uses this to provide safe defaults in navigating pages. Can be overloaded with changes only.

## Utilities

Helpful utility functions for dev's.

- async sleep(milliseconds: number)
Pauses program execution until time provided is awaited.