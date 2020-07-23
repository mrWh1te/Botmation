import { createFolderURL, getFileUrl } from '../../../botmation/helpers/files'

/**
 * @description   Helpers: Assets (ie screenshots, cookies)
 */
describe('[Botmation] helpers/assets', () => {

  //
  // Unit Tests
  it('createFolderURL should create the url with preceding backslash scheme (not trailing) to support dynamically appending filename else where', async () => {
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

  it('getFileUrl should remain coupled to our suggestive but open directory structure in saved files to disk (hard drive)', async () => {    
    const undefinedValue = undefined as any
    const botOptionsUndefinedParentDirectory = { parent_output_directory: undefined } as any
    const botOptionsWithParentDirectory = { parent_output_directory: 'parent' } as any

    const fileUrl00 = getFileUrl(undefinedValue, undefinedValue) // nothing but undefined's
    const fileUrl0 = getFileUrl(undefinedValue, botOptionsUndefinedParentDirectory) // getting undefined values

    const fileUrl1 = getFileUrl('1', botOptionsUndefinedParentDirectory)
    const fileUrl1Parent = getFileUrl('1', botOptionsWithParentDirectory)
    const fileUrl1ParentFileName = getFileUrl('1', botOptionsWithParentDirectory, 'example.json')
    
    // fail safe cases to monitor
    expect(fileUrl00).toEqual('./')
    expect(fileUrl0).toEqual('./')

    // supported edge-cases
    expect(fileUrl1).toEqual('./1')
    expect(fileUrl1Parent).toEqual('./parent/1')
    expect(fileUrl1ParentFileName).toEqual('./parent/1/example.json')
  })

})
