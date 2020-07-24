import { unpipeInjects, getInjectsPipeOrEmptyPipe, createEmptyPipe, wrapValueInPipe } from "botmation/helpers/pipe"


/**
 * @description   Pipe Helpers
 */
describe('[Botmation] helpers/pipe', () => {
  //
  // Injects with various Piping:

  // No Pipe
  const injectsEmpty: any[] = []
  const injectsFullWithoutPipe = ['hi', {test: 2}, 77]

  // Empty Pipe
  const injectsOnlyEmptyPipe = [{brand: 'Pipe'}]
  const injectsFullWithEmptyPipe = [...injectsFullWithoutPipe, ...injectsOnlyEmptyPipe]

  // Pipe with Value
  const injectsFullWithPipeNumber = [...injectsFullWithoutPipe, {brand: 'Pipe', value: 5}]

  it('unpipeInjects() should safely unpipe injects which is to return the injects with the Pipe value at the end, not the Pipe and if missing the Pipe, return undefined like an Empty Pipe', () => {
    // safe fallbacks for missing Pipe
    expect(unpipeInjects(injectsEmpty)).toEqual([undefined])
    expect(unpipeInjects(injectsFullWithoutPipe)).toEqual(['hi', {test: 2}, 77, undefined])

    // unpiping injects
    expect(unpipeInjects(injectsOnlyEmptyPipe)).toEqual([undefined])
    expect(unpipeInjects(injectsFullWithEmptyPipe)).toEqual(['hi', {test: 2}, 77, undefined])
    expect(unpipeInjects(injectsFullWithPipeNumber)).toEqual(['hi', {test: 2}, 77, 5])
  })

  it('getInjectsPipeOrEmptyPipe() should get a Pipe from provided injects or provide a safe fallback for missing Pipe, an empty one', () => {
    expect(getInjectsPipeOrEmptyPipe(injectsEmpty)).toEqual({brand: 'Pipe'})
    expect(getInjectsPipeOrEmptyPipe(injectsFullWithoutPipe)).toEqual({brand: 'Pipe'})

    expect(getInjectsPipeOrEmptyPipe(injectsOnlyEmptyPipe)).toEqual({brand: 'Pipe'})
    expect(getInjectsPipeOrEmptyPipe(injectsFullWithEmptyPipe)).toEqual({brand: 'Pipe'})

    expect(getInjectsPipeOrEmptyPipe(injectsFullWithPipeNumber)).toEqual({brand: 'Pipe', value: 5})
  })

  it('createEmptyPipe() should create an empty Pipe', () => {
    expect(createEmptyPipe()).toEqual({brand: 'Pipe'})
  })

  it('wrapValueInPipe() should wrap value in a Pipe with a safe fallback for missing value, being an empty Pipe', () => {
    expect(wrapValueInPipe()).toEqual({brand: 'Pipe'})
    expect(wrapValueInPipe(undefined)).toEqual({brand: 'Pipe'})
    expect(wrapValueInPipe(5)).toEqual({brand: 'Pipe', value: 5})
    expect(wrapValueInPipe('dog')).toEqual({brand: 'Pipe', value: 'dog'})
    expect(wrapValueInPipe(true)).toEqual({brand: 'Pipe', value: true})
    expect(wrapValueInPipe({test: 22})).toEqual({brand: 'Pipe', value: {test: 22}})
    
    // Testing the ability of Pipe value being a Function
    const getNumber1 = () => 1

    // test code
    const testPipe = wrapValueInPipe(getNumber1)
    expect(testPipe.brand).toEqual('Pipe')
    
    // either value is undefined to break the test
    expect(testPipe.value).not.toBeUndefined()
    // or we run this test that we want to check
    if (testPipe.value) {
      expect(testPipe.value()).toEqual(1)
    }
  })


  // it('enrichGoToPageOptions() should take a partial of Puppeteer.DirectNavigationOptions to overload the default values it provides in one as a safe fallback', () => {
  //   const directNavigationOptionsEmpty: Partial<DirectNavigationOptions> = {}
  //   const directNavigationOptionsWaitUntil: Partial<DirectNavigationOptions> = {waitUntil: 'domcontentloaded'}

  //   const enrichDirectNavigationOptionsFromUndefined = enrichGoToPageOptions()
  //   const enrichDirectNavigationOptionsFromEmpty = enrichGoToPageOptions(directNavigationOptionsEmpty)
  //   const enrichDirectNavigationOptionsFromWaitUntil = enrichGoToPageOptions(directNavigationOptionsWaitUntil)

  //   // default cases (safe fallbacks)
  //   expect(enrichDirectNavigationOptionsFromUndefined).toEqual({
  //     waitUntil: 'networkidle0'
  //   })
  //   expect(enrichDirectNavigationOptionsFromEmpty).toEqual({
  //     waitUntil: 'networkidle0'
  //   })

  //   // overwriting default
  //   expect(enrichDirectNavigationOptionsFromWaitUntil).toEqual({
  //     waitUntil: 'domcontentloaded'
  //   })
  // })

})
