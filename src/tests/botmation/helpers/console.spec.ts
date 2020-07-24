import chalk, { Chalk } from 'chalk'

import { prependSpacing, appendSpacing, logMessage } from 'botmation/helpers/console'

/**
 * @description   Console Helpers
 */
describe('[Botmation] helpers/console', () => {
  let logs: any[]

  const HELLO_DOG_COPY = 'Hello dog'

  beforeAll(() => {
    console.log = function() {
      logs.push(
        ([].slice.call(arguments))[0]
      )
    }
  })  

  beforeEach(() => {
    logs = []
  })

  //
  // Unit Tests
  it('has prependSpacing() for adding literal spaces by size before provided copy', () => {
    const prependCopyNoSize = prependSpacing(HELLO_DOG_COPY)
    const prependCopy0Size = prependSpacing(HELLO_DOG_COPY, 0)
    const prependCopy1Size = prependSpacing(HELLO_DOG_COPY, 1)
    const prependCopy7Size = prependSpacing(HELLO_DOG_COPY, 7)

    expect(prependCopyNoSize).toEqual('Hello dog')
    expect(prependCopy0Size).toEqual('Hello dog')
    expect(prependCopy1Size).toEqual(' Hello dog')
    expect(prependCopy7Size).toEqual('       Hello dog')
  })

  it('has appendSpacing() for adding literal spaces by size after provided copy', () => {
    const appendCopyNoSize = appendSpacing(HELLO_DOG_COPY)
    const appendCopy0Size = appendSpacing(HELLO_DOG_COPY, 0)
    const appendCopy1Size = appendSpacing(HELLO_DOG_COPY, 1)
    const appendCopy7Size = appendSpacing(HELLO_DOG_COPY, 7)

    expect(appendCopyNoSize).toEqual('Hello dog')
    expect(appendCopy0Size).toEqual('Hello dog')
    expect(appendCopy1Size).toEqual('Hello dog ')
    expect(appendCopy7Size).toEqual('Hello dog       ')
  })

  it('has logMessage() for logging a success themed string to console', () => {
    const successMessage = 'Success'
    const emptyMessage = ''

    logMessage(successMessage)
    logMessage(emptyMessage)

    expect(logs[0]).toEqual(' Log:      Success')
    expect(logs[1]).toEqual(' Log:      ')
  })

// /**
//  * @description  Log a warning themed string to console
//  * @param warning 
//  */
// export const logWarning = (warning: string) => 
//   console.log(
//     warningTheme(' Warning: ') + prependSpacing(warning, 1)
//   )
// /**
//  * @description  Log an error themed string to console
//  * @param error 
//  */
// export const logError = (error: string) =>
//   console.log(
//     errorTheme(appendSpacing(' Error:', 3)) + prependSpacing(error, 1)
//   )

// /**
//  * @description  Log a piped themed value to console with support for value types: undefined, object, boolean, function, number, and string
//  * @param value Pipe.value
//  */  
// export const logPipeValue = (value: any) => {
//   if (value === undefined) {
//     console.log(
//       pipedTheme(appendSpacing(' - pipe:', 2)) + prependSpacing('Empty', 1)
//     )
//   }
//   if (typeof value === 'object' || typeof value === 'boolean' || typeof value === 'function') {
//     console.log(
//       pipedTheme(appendSpacing(' - pipe:', 2)) + prependSpacing(JSON.stringify(value), 1)
//     )
//   }
//   if (typeof value === 'number' || typeof value === 'string') {
//     console.log(
//       pipedTheme(appendSpacing(' - pipe:', 2)) + prependSpacing(value + '', 1)
//     )
//   }
// }



  // it('should log a message to console', async () => {
  //   await log('example message')(page)

  //   // Get around the Chalk styling
  //   expect(logs[0][0]).toEqual(expect.stringMatching('Log:'))
  //   expect(logs[0][0]).toEqual(expect.stringMatching('example message'))
  // })

  // it('should log a warning to console', async () => {    
  //   await warning('example warning')(page)

  //   // Get around the Chalk styling
  //   expect(logs[0][0]).toEqual(expect.stringMatching('Warning:'))
  //   expect(logs[0][0]).toEqual(expect.stringMatching('example warning'))
  // })

  // it('should log an error to console', async () => {    
  //   await error('example error')(page)

  //   // Get around the Chalk styling
  //   expect(logs[0][0]).toEqual(expect.stringMatching('Error:'))
  //   expect(logs[0][0]).toEqual(expect.stringMatching('example error'))
  // })

})
