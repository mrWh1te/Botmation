var readlineSync = require('readline-sync')
var fs = require('fs')
var path = require('path')

var appRoot = require('app-root-path')

const configFilePath = './src/config.ts'

if (process.argv.indexOf('baseonly') !== -1) {
  // this particular argument for CI, when we dont want a walkthrough
  // but the bare necessities of the config file to run the tests
  saveConfigFile(getConfigFileText('', '', 'assets', 'cookies', 'screenshots'))
  return
}

// Header Print
printHeader()

//

console.log('1 = ' + path.resolve(__dirname).split('/node_modules')[0])
console.log('2 = ' + path.dirname(require.main.filename))
console.log('3 = ' + __dirname)

// outisde4 of scripts/ botmatoin/ node_modules/ to root project directory from here

//

emptyLine()
let overwriteFileIfExists = false

// Check for `overwrite` flag to skip file existence check before creating one
// supports shorthand notation, `o`
if (process.argv.indexOf('overwrite') !== -1 || process.argv.indexOf('o') !== -1) {
  overwriteFileIfExists = true
}

// 1. Detect if the config file has already been created
(async() => {
  let rootAssetsDirectory, cookiesDirectory, sceenshotsDirectory;

  try {
    if (fs.existsSync(configFilePath) ) {
      // file exists, do nothing
      console.log('[NOTICE] File: "./src/config.ts" exists\n')
      if (overwriteFileIfExists) {
        console.log('[NOTICE] Flag `overwrite` provided, lets recreate the config file')
        await createConfigFileCLIWalkthrough()
        await createAssetDirectories(rootAssetsDirectory, sceenshotsDirectory, cookiesDirectory)
      } else {
        completeSuccess()
      }
    } else {
      console.log('[NOTICE] File: "./src/config.ts" is missing\n')
      await createConfigFileCLIWalkthrough()
      await createAssetDirectories(rootAssetsDirectory, sceenshotsDirectory, cookiesDirectory)
    }
  } catch(err) {
    console.error(err)
  }

  async function createConfigFileCLIWalkthrough() {
    // 2. Check with the dev, if they want to use this script, since the config file is not a hard requirement
    if (readlineSync.keyInYN('Do you want to customize it?')) {
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
      // Root Assets Directory
      // if the dev hits enter without entering any text, we provide the default value
      rootAssetsDirectory = readlineSync.question('Root directory name for all generated assets (assets) ? ') || 'assets'
      okay()
      
      //
      // Cookies Directory
      // if the dev hits enter without entering any text, we provide the default value
      cookiesDirectory = readlineSync.question('Assets directory name for cookies (cookies) ? ') || 'cookies'
      okay()
  
      //
      // Screenshots Directory
      // if the dev hits enter without entering any text, we provide the default value
      sceenshotsDirectory = readlineSync.question('Assets directory name for screenshots (screenshots) ? ') || 'screenshots'
      okay()
  
      //
      // Data collected, now let's create the config file
      await saveConfigFile(getConfigFileText(instagramUsername, instagramPassword, rootAssetsDirectory, cookiesDirectory, sceenshotsDirectory))
    } else {
      // Another key was pressed.
      await saveConfigFile(getConfigFileText('', '', 'assets', 'cookies', 'screenshots'))
      console.log('Okay, good bye')
      return
    }
  }
})()

async function createAssetDirectories(assetsDirectory = 'assets', screenshotsDirectory = 'screenshots', cookiesDirectory = 'cookies') {
  console.log('[createAssetDirectories] assetsDirectory = ' + assetsDirectory)
  console.log('[APP ROOT] = ', + appRoot)
  await createDirectoryIfNotExist(assetsDirectory)
  await createDirectoryIfNotExist(assetsDirectory + '/' + screenshotsDirectory)
  await createDirectoryIfNotExist(assetsDirectory + '/' + cookiesDirectory)
}

async function createDirectoryIfNotExist(directory) {
  return new Promise(async(resolve) => {
    fs.access('./' + directory, async(err) => {
      if (err && err.code === 'ENOENT') {
        await createDirectory(directory)
        return resolve()
      }
      return resolve()
    })
  })
}

async function createDirectory(directory) {
  return new Promise((resolve, reject) => {
    fs.mkdir(directory, (err) => {
      if (err) {
        return reject(err)
      }
      console.log(`[NOTICE] Directory: "${directory}" has been created!\n`)
      return resolve()
    })
  })
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
  return new Promise((resolve, reject) => {
    fs.writeFile(configFilePath, fileText, 'utf8', function (err) {
      if (err) {
        console.log('[ERROR] unable to create "./src/config.ts"\n')
        return reject(err)
      }
  
      console.log('[NOTICE] "./src/config.ts" has been created!\n')
      return resolve()
      // completeSuccess()
    });
  })
}

//
// Template
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