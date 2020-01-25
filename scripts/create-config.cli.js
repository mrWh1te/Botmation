var readlineSync = require('readline-sync')
var fs = require('fs')

const configFilePath = './src/config.ts'

// Header Print
printHeader()

// 1. Detect if the config file has already been created
try {
  if (fs.existsSync(configFilePath)) {
    // file exists, do nothing
    console.log('[NOTICE] File: "./src/config.ts" exists\n')
    completeSuccess()
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
    var rootAssetsDirectory = readlineSync.question('Root directory name for all generated assets (assets) ? ') || 'assets' // TODO: adjust code, to prepend './' to ./assets
    okay()
    
    //
    // Cookies Directory
    // if the dev hits enter without entering any text, we provide the default value
    var cookiesDirectory = readlineSync.question('Directory name for cookies (cookies) ? ') || 'cookies' // TODO: update code to append backslash (removed it after cookies/, look at cookie code)
    okay()

    //
    // Screenshots Directory
    // if the dev hits enter without entering any text, we provide the default value
    var sceenshotsDirectory = readlineSync.question('Directory name for screenshots (screenshots) ? ') || 'screenshots' // TODO: adjust code to remove "pages" from current screenshots saving

    //
    // Data collected, now let's create the config file
    saveConfigFile(getConfigFileText(instagramUsername, instagramPassword, cookiesDirectory))
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
function getConfigFileText(username, password, cookiesDirectory) {
  return `
  /**
   * Main Configuration to setup the Bot
   */

  export const ACCOUNT_USERNAME = '${username}'
  export const ACCOUNT_PASSWORD = '${password}'

  // TODO: determine how to manage auth of multiple bots

  /**
   * @note from the root project directory
   * @default   \`./assets/cookies/\`
   */
  export const COOKIES_DIRECTORY_PATH = '${cookiesDirectory}'`
}