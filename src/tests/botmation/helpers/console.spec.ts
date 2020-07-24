import chalk, { Chalk } from 'chalk'

import { prependSpacing, appendSpacing, logMessage, logWarning, logError, logPipeValue } from 'botmation/helpers/console'

/**
 * @description   Console Helpers
 */
describe('[Botmation] helpers/console', () => {
  let logs: any[]

  const HELLO_DOG_COPY = 'Hello dog'
  const EMPTY_STRING = ''

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

  // The following tests focus on "message" alignment for consistency across types of log*()
  it('has logMessage() for logging a success themed string to console', () => {
    const successMessage = 'Success'

    logMessage(successMessage)
    logMessage(EMPTY_STRING)

    expect(logs[0]).toEqual(' Log:      Success')
    expect(logs[1]).toEqual(' Log:      ')
  })

  it('has logWarning() for logging a warning themed string to console', () => {
    const warningMessage = 'Careful'

    logWarning(warningMessage)
    logWarning(EMPTY_STRING)

    expect(logs[0]).toEqual(' Warning:  Careful')
    expect(logs[1]).toEqual(' Warning:  ')
  })

  it('has logError() for logging an error themed string to console', () => {
    const errorMessage = 'Missing'

    logError(errorMessage)
    logError(EMPTY_STRING)

    expect(logs[0]).toEqual(' Error:    Missing')
    expect(logs[1]).toEqual(' Error:    ')
  })

  it('has logPipeValue() for logging an error themed string to console', () => {
    const undefinedValue = undefined
    const stringValue = 'a string'
    const numberValue = 5
    const functionValue = () => 0
    const objectValue = {}
    const trueBooleanValue = true
    const falseBooleanValue = false

    logPipeValue(EMPTY_STRING)
    expect(logs[0]).toEqual(' - pipe:   ')

    logPipeValue(undefinedValue)
    expect(logs[1]).toEqual(' - pipe:   Empty')

    logPipeValue(stringValue)
    expect(logs[2]).toEqual(' - pipe:   a string')

    logPipeValue(numberValue)
    expect(logs[3]).toEqual(' - pipe:   5')

    logPipeValue(functionValue)
    expect(logs[4]).toEqual(' - pipe:   () => 0')

    logPipeValue(objectValue)
    expect(logs[5]).toEqual(' - pipe:   {}')

    logPipeValue(trueBooleanValue)
    expect(logs[6]).toEqual(' - pipe:   true')

    logPipeValue(falseBooleanValue)
    expect(logs[7]).toEqual(' - pipe:   false')
  })

})
