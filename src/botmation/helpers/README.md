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

## Console

The higher order Console Bot Actions  use these functions, so if you want to use the colorful logging messages outside a chain of actions, you can use these methods directly:

- logMessage(message: string)
Logs a clear green message to the Console

- logWarning(warning: string)
Logs a orange warning message to the Console

- logError(error: string)
Logs a red error message to the Console
