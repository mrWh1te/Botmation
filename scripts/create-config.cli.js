var readlineSync = require('readline-sync')
var fs = require('fs')

const configFilePath = './src/config.ts'

// Header Print
console.log('#######################################')
console.log('## Botmation: CLI Create "config.ts" ##')
console.log('#######################################')
emptyLine()

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
  // 2. If it hasn't then run this script, else end
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
    // Cookies Directory Path
    var cookiesDirectory = readlineSync.question('Directory for cookies (./assets/cookies/) ? ') || '/assets/cookies/'
    okay()

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
  console.log('All set, good bye!\n')
}

function saveConfigFile(fileText) {
  console.log('fileText = '+fileText)

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