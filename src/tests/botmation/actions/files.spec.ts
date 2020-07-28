

import { Page } from "puppeteer"
import { files } from "botmation/actions/files"
import { BotFileOptions } from "botmation/interfaces"

// Mock the Injects Module so when files() imports it
// we can test how injects() is called within files()
// particularly interested in the first param, an enriched BotFileOptions
jest.mock('botmation/actions/inject', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('botmation/actions/inject')

  return {
    // __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    inject: jest.fn(() => () => () => {})
  }
})

/**
 * @description   Files BotAction
 */
describe('[Botmation] actions/files', () => {

  let mockPage = {} as any as Page
  
  //
  // Basic Unit Tests
  it('should set the 1st inject as an enriched BotFileOptions object with overloaded values based on whats passed in files()', async () => {
    // no BotFileOptions
    await files()()(mockPage)

    // partial botFileOptions - 1 key/value pair
    await files({screenshots_directory: 'screenshots'})()(mockPage)
    await files({cookies_directory: 'cookies'})()(mockPage)

    // full botFileOptions
    const botfileOptions: BotFileOptions = {
      parent_output_directory: 'parent',
      screenshots_directory: 's',
      cookies_directory: 'c',
      pdfs_directory: 'p'
    }
    await files(botfileOptions)()(mockPage)

    const mockInjectMethod = require('botmation/actions/inject').inject
    
    expect(mockInjectMethod).toHaveBeenNthCalledWith(1, {
      screenshots_directory: '',
      cookies_directory: '',
      pdfs_directory: ''
    })
    expect(mockInjectMethod).toHaveBeenNthCalledWith(2, {
      screenshots_directory: 'screenshots',
      cookies_directory: '',
      pdfs_directory: ''
    })
    expect(mockInjectMethod).toHaveBeenNthCalledWith(3, {
      screenshots_directory: '',
      cookies_directory: 'cookies',
      pdfs_directory: ''
    })
    expect(mockInjectMethod).toHaveBeenNthCalledWith(4, {
      parent_output_directory: 'parent',
      screenshots_directory: 's',
      cookies_directory: 'c',
      pdfs_directory: 'p'
    })
  })

  afterAll(() => {
    // unmock the module for other tests
    jest.unmock('botmation/actions/inject')
  })
  
})
