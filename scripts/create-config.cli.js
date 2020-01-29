var readlineSync = require('readline-sync')
var fs = require('fs')

const configFilePath = './src/config.ts'

// Header Print
printHeader()

emptyLine()
let overwriteFileIfExists = false

// Check for `overwrite` flag to skip file existence check before creating one
// supports shorthand notation, `o`
if (process.argv.indexOf('overwrite') !== -1 || process.argv.indexOf('o') !== -1) {
  overwriteFileIfExists = true
}

// 1. Detect if the config file has already been created
try {
  if (fs.existsSync(configFilePath) ) {
    // file exists, do nothing
    console.log('[NOTICE] File: "./src/config.ts" exists\n')
    if (overwriteFileIfExists) {
      console.log('[NOTICE] Flag `overwrite` provided, lets recreate the config file')
      createConfigFileCLIWalkthrough()
    } else {
      completeSuccess()
    }
  } else {
    console.log('[NOTICE] File: "./src/config.ts" is missing\n')
    createConfigFileCLIWalkthrough()
  }
} catch(err) {
  console.error(err)
}

function createConfigFileCLIWalkthrough() {
  // 2. Check with the dev, if they want to use this script, since the config file is not a hard requirement
  if (readlineSync.keyInYN('Do you want to create it now?')) {
    // 'Y' key was pressed.
    okay()
    
    //
    // Instagram Auth Credentials
    var instagramUsername = readlineSync.question('What is your Instagram username ? ')
    okay()
    
    // Handle the secret text (e.g. password).
    var instagramPassword = readlineSync.question('What is your Instagram password ? ', {
      hideEchoBack: true
    })
    okay()
    
    //
    // TODO: directories: assets, assets/screenshots
    // if the dev hits enter without entering any text, we provide the default value
    var rootAssetsDirectory = readlineSync.question('Root directory name for all generated assets (assets) ? ') || 'assets'
    okay()
    
    //
    // Cookies Directory
    // if the dev hits enter without entering any text, we provide the default value
    var cookiesDirectory = readlineSync.question('Directory name for cookies (cookies) ? ') || 'cookies'
    okay()

    //
    // Screenshots Directory
    // if the dev hits enter without entering any text, we provide the default value
    var sceenshotsDirectory = readlineSync.question('Directory name for screenshots (screenshots) ? ') || 'screenshots'
    okay()

    //
    // Data collected, now let's create the config file
    saveConfigFile(getConfigFileText(instagramUsername, instagramPassword, rootAssetsDirectory, cookiesDirectory, sceenshotsDirectory))
  } else {
    // Another key was pressed.
    console.log('Okay, good bye')
  }
}

//
// Helper functions
function emptyLine() {
  console.log('')
}
function okay() {
  console.log('Okay.\n')
}
function completeSuccess() {
  console.log('You\'re all set, good bye!\n')
}
function printHeader() {
  console.log(' #######################################')
  console.log(' ##          Botmation: CLI           ##')
  console.log(' #######################################')
  emptyLine()
}

function saveConfigFile(fileText) {
  fs.writeFile(configFilePath, fileText, 'utf8', function (err) {
    if (err) {
      console.log('[ERROR] unable to create "./src/config.ts"\n')
    }

    console.log('[NOTICE] "./src/config.ts" has been created!\n')
    completeSuccess()
  });
}

//
// Templates
function getConfigFileText(username, password, assetsDirectory, cookiesDirectory, screenshotsDirectory) {
  return `

  /**
   * Main Configuration to setup the Bot
   */

  export const ACCOUNT_USERNAME = '${username}'
  export const ACCOUNT_PASSWORD = '${password}'

  /**
   * @description   Root directory for outputted assets
   *                Screenshots, Cookies, etc. directories below are put in this one, which is in the root directory of the project
   * @default   'assets'
   */
  export const ROOT_ASSETS_DIRECTORY = '${assetsDirectory}'

  /**
   * @note
   * @default   'cookies'
   */
  export const ASSETS_COOKIES_DIRECTORY = '${cookiesDirectory}'

  /**
   * @default   'screenshots'
   */
  export const ASSETS_SCREENSHOTS_DIRECTORY = '${screenshotsDirectory}'`
}