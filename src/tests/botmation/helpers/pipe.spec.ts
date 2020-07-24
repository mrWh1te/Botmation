import { unpipeInjects, getInjectsPipeOrEmptyPipe } from "botmation/helpers/pipe"


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
