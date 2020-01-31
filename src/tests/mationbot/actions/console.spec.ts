import { log, warning, error } from '@mationbot/actions/console'

/**
 * @description   Console Action Factory
 *                The factory methods here return BotAction's for the bots to log themed messages in console
 * @note          These messages are logged to the Node console, not the Puppeteer page console.
 */
describe('[MationBot:Action Factory] Console', () => {
  let logs: any[]

  beforeAll(() => {
    // We can do Integration instead, by jest.fn() the log, then checking we call it with params
    console.log = function() {
      logs.push([].slice.call(arguments))
    }
  })  

  beforeEach(() => {
    logs = []
  })

  //
  // Unit Tests
  it('should log a message to console', async () => {
    await log('example message')(page)

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Log:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example message'))
  })

  it('should log a warning to console', async () => {    
    await warning('example warning')(page)

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Warning:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example warning'))
  })

  it('should log an error to console', async () => {    
    await error('example error')(page)

    // Get around the Chalk styling
    expect(logs[0][0]).toEqual(expect.stringMatching('Error:'))
    expect(logs[0][0]).toEqual(expect.stringMatching('example error'))
  })

})
