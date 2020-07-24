import { createFolderURL, getFileUrl, enrichBotFileOptionsWithDefaults } from '../../../botmation/helpers/files'
import { BotFileOptions } from 'botmation/interfaces'

/**
 * @description   Helpers: Assets (ie screenshots, cookies)
 */
describe('[Botmation] helpers/assets', () => {

  //
  // Unit Tests
  it('createFolderURL() should create the url with preceding backslash scheme (not trailing) to support dynamically appending filename else where', () => {
    const url00 = createFolderURL()
    const url0 = createFolderURL('')
    
    const url1 = createFolderURL('1')
    const url12 = createFolderURL('1', '2')
    const url12345 = createFolderURL('1', '2', '3', '4', '5')

    // fail safes
    expect(url00).toEqual('.')
    expect(url0).toEqual('./')

    // supported edge cases
    expect(url1).toEqual('./1')
    expect(url12).toEqual('./1/2')
    expect(url12345).toEqual('./1/2/3/4/5')
  })

  it('getFileUrl() should remain coupled to our suggestive but open directory structure in saved files to disk (hard drive)', () => {    
    const undefinedValue = undefined as any
    const botFileOptionsUndefinedParentDirectory = { parent_output_directory: undefined } as any
    const botFileOptionsWithParentDirectory = { parent_output_directory: 'parent' } as any

    const fileUrl00 = getFileUrl(undefinedValue, undefinedValue) // nothing but undefined's
    const fileUrl0 = getFileUrl(undefinedValue, botFileOptionsUndefinedParentDirectory) // getting undefined values

    const fileUrl1 = getFileUrl('1', botFileOptionsUndefinedParentDirectory)
    const fileUrl1Parent = getFileUrl('1', botFileOptionsWithParentDirectory)
    const fileUrl1ParentFileName = getFileUrl('1', botFileOptionsWithParentDirectory, 'example.json')
    
    // fail safe cases to monitor
    expect(fileUrl00).toEqual('./')
    expect(fileUrl0).toEqual('./')

    // supported edge-cases
    expect(fileUrl1).toEqual('./1')
    expect(fileUrl1Parent).toEqual('./parent/1')
    expect(fileUrl1ParentFileName).toEqual('./parent/1/example.json')
  })

  it('enrichBotFileOptionsWithDefaults() should take a partial of any kind to overload the default values it provides for a BotFileOptions', () => {
    const botFileOptionsEmpty: Partial<BotFileOptions> = {}
    const botFileOptionsParentDirectory: Partial<BotFileOptions> = { parent_output_directory: 'parent' }
    const botFileOptionsScreenshotsDirectory: Partial<BotFileOptions> = { screenshots_directory: 'screenshots' }
    const botFileOptionsPDFsDirectory: Partial<BotFileOptions> = { pdfs_directory: 'pdfs' }
    const botFileOptionsCookiesDirectory: Partial<BotFileOptions> = { cookies_directory: 'cookies' }

    const enrichBotFileOptionsFromUndefined = enrichBotFileOptionsWithDefaults()
    const enrichBotFileOptionsFromEmpty = enrichBotFileOptionsWithDefaults(botFileOptionsEmpty)
    const enrichBotFileOptionsFromParentDirectory = enrichBotFileOptionsWithDefaults(botFileOptionsParentDirectory)
    const enrichBotFileOptionsFromScreenshotsDirectory = enrichBotFileOptionsWithDefaults(botFileOptionsScreenshotsDirectory)
    const enrichBotFileOptionsFromPDFsDirectory = enrichBotFileOptionsWithDefaults(botFileOptionsPDFsDirectory)
    const enrichBotFileOptionsFromCookiesDirectory = enrichBotFileOptionsWithDefaults(botFileOptionsCookiesDirectory)

    expect(enrichBotFileOptionsFromUndefined).toEqual({
      screenshots_directory: '',
      pdfs_directory: '',
      cookies_directory: ''
    })
    expect(enrichBotFileOptionsFromEmpty).toEqual({
      screenshots_directory: '',
      pdfs_directory: '',
      cookies_directory: ''
    })
    expect(enrichBotFileOptionsFromParentDirectory).toEqual({
      parent_output_directory: 'parent',
      screenshots_directory: '',
      pdfs_directory: '',
      cookies_directory: ''
    })
    expect(enrichBotFileOptionsFromScreenshotsDirectory).toEqual({
      screenshots_directory: 'screenshots',
      pdfs_directory: '',
      cookies_directory: ''
    })
    expect(enrichBotFileOptionsFromPDFsDirectory).toEqual({
      screenshots_directory: '',
      pdfs_directory: 'pdfs',
      cookies_directory: ''
    })
    expect(enrichBotFileOptionsFromCookiesDirectory).toEqual({
      screenshots_directory: '',
      pdfs_directory: '',
      cookies_directory: 'cookies'
    })
  })

})
