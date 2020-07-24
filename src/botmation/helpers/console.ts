import chalk from 'chalk'

/**
 * @description   We use the package 'chalk' to add color to the messages logged in console
 * @note          The colors don't seem to work in a regular Windows console, but the spacing does
 */

// Chalk Themes
const successTheme = chalk.bgGreen
const warningTheme = chalk.bgYellow
const errorTheme = chalk.bgRed
const pipeTheme = chalk.bgBlue

/**
 * @description  Log a successfully themed string to console
 * @param message 
 */
export const logMessage = (message: string) => 
  console.log(
    successTheme(appendSpacing(' Log:', 5)) + prependSpacing(message, 1)
  )
/**
 * @description  Log a warning themed string to console
 * @param warning 
 */
export const logWarning = (warning: string) => 
  console.log(
    warningTheme(' Warning: ') + prependSpacing(warning, 1)
  )
/**
 * @description  Log an error themed string to console
 * @param error 
 */
export const logError = (error: string) =>
  console.log(
    errorTheme(appendSpacing(' Error:', 3)) + prependSpacing(error, 1)
  )

/**
 * @description  Log a piped themed value to console with support for value types: undefined, object, boolean, function, number, and string
 * @param value Pipe.value
 */  
export const logPipeValue = (value: any) => {
  if (value === undefined) {
    console.log(
      pipeTheme(appendSpacing(' - pipe:', 2)) + prependSpacing('Empty', 1)
    )
  }
  if (typeof value === 'object' || typeof value === 'boolean' || typeof value === 'function') {
    console.log(
      pipeTheme(appendSpacing(' - pipe:', 2)) + prependSpacing(JSON.stringify(value), 1)
    )
  }
  if (typeof value === 'number' || typeof value === 'string') {
    console.log(
      pipeTheme(appendSpacing(' - pipe:', 2)) + prependSpacing(value + '', 1)
    )
  }
}

/**
 * @description   Prepend spacing before copy provided based on size
 * @param copy    Message to move to the right by sized spacing
 * @param size    1 = 1 space ( n = n spaces )
 */
export const prependSpacing = (copy: string, size: number = 0): string => {
  if (!size) {
    return copy
  }

  let gutter = ''
  for(let i = 0; i < size; i++) {
    gutter += ' '
  } 

  return gutter + copy
}
/**
 * @description   Append spacing after copy provided based on size
 * @param copy    Message to append spacing too
 * @param size    1 = 1 space ( n = n spaces )
 */
export const appendSpacing = (copy: string, size: number = 0): string => {
  if (!size) {
    return copy
  }

  let gutter = ''
  for(let i = 0; i < size; i++) {
    gutter += ' '
  } 

  return copy + gutter
}