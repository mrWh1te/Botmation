import { unpipeInjects, getInjectsPipeOrEmptyPipe, createEmptyPipe, wrapValueInPipe, injectsHavePipe, getInjectsPipeValue, pipeInjects } from "@botmation/core"


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
  // new
  const injectsOnlyPipeNumber = [{brand: 'Pipe', value: 5}]

  it('unpipeInjects() should safely unpipe injects which is to return the injects with the Pipe value at the start, and if missing a Pipe, return undefined like an Empty Pipe', () => {
    // safe fallbacks for missing Pipe
    expect(unpipeInjects(injectsEmpty)).toEqual([undefined])
    expect(unpipeInjects(injectsFullWithoutPipe)).toEqual([undefined, 'hi', {test: 2}, 77])

    // unpiping injects, empty pipe
    expect(unpipeInjects(injectsOnlyEmptyPipe)).toEqual([undefined])
    expect(unpipeInjects(injectsFullWithEmptyPipe)).toEqual([undefined, 'hi', {test: 2}, 77])

    // with value
    expect(unpipeInjects(injectsFullWithPipeNumber)).toEqual([5, 'hi', {test: 2}, 77])
    expect(unpipeInjects(injectsOnlyPipeNumber)).toEqual([5])
  })

  it('getInjectsPipeOrEmptyPipe() should get a Pipe from provided injects or provide a safe fallback for missing Pipe, an empty one', () => {
    expect(getInjectsPipeOrEmptyPipe(injectsEmpty)).toEqual({brand: 'Pipe'})
    expect(getInjectsPipeOrEmptyPipe(injectsFullWithoutPipe)).toEqual({brand: 'Pipe'})

    expect(getInjectsPipeOrEmptyPipe(injectsOnlyEmptyPipe)).toEqual({brand: 'Pipe'})
    expect(getInjectsPipeOrEmptyPipe(injectsFullWithEmptyPipe)).toEqual({brand: 'Pipe'})

    expect(getInjectsPipeOrEmptyPipe(injectsFullWithPipeNumber)).toEqual({brand: 'Pipe', value: 5})
    expect(getInjectsPipeOrEmptyPipe(injectsOnlyPipeNumber)).toEqual({brand: 'Pipe', value: 5})
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
    expect(testPipe.value).not.toBeFalsy()
    // or we run this test that we want to check
    if (testPipe.value) {
      expect(testPipe.value()).toEqual(1)
    }
  })

  it('injectsHavePipe() should return TRUE only if the provided injects have a Pipe, otherwise it returns FALSE', () => {
    expect(injectsHavePipe(injectsEmpty)).toEqual(false)
    expect(injectsHavePipe(injectsFullWithoutPipe)).toEqual(false)
    expect(injectsHavePipe(injectsOnlyEmptyPipe)).toEqual(true)
    expect(injectsHavePipe(injectsFullWithEmptyPipe)).toEqual(true)
    expect(injectsHavePipe(injectsFullWithPipeNumber)).toEqual(true)
    expect(injectsHavePipe(injectsOnlyPipeNumber)).toEqual(true)
  })

  it('getInjectsPipeValue() should return the injects Pipe\'s value unless missing a Pipe, then the safe flalback is undefined like an empty Pipe', () => {
    expect(getInjectsPipeValue(injectsEmpty)).toEqual(undefined)
    expect(getInjectsPipeValue(injectsFullWithoutPipe)).toEqual(undefined)
    expect(getInjectsPipeValue(injectsOnlyEmptyPipe)).toEqual(undefined)
    expect(getInjectsPipeValue(injectsFullWithEmptyPipe)).toEqual(undefined)
    expect(getInjectsPipeValue(injectsFullWithPipeNumber)).toEqual(5)
    expect(getInjectsPipeValue(injectsOnlyPipeNumber)).toEqual(5)
  })

  it('pipeInjects() should return the injects provided with a Pipe at the end', () => {
    // safe fallbacks for missing Pipe
    expect(pipeInjects(injectsEmpty)).toEqual([{brand: 'Pipe'}])
    expect(pipeInjects(injectsFullWithoutPipe)).toEqual(['hi', {test: 2}, 77, {brand: 'Pipe'}])

    // unpiping injects, empty pipe
    expect(pipeInjects(injectsOnlyEmptyPipe)).toEqual([{brand: 'Pipe'}])
    expect(pipeInjects(injectsFullWithEmptyPipe)).toEqual(['hi', {test: 2}, 77, {brand: 'Pipe'}])

    // with value
    expect(pipeInjects(injectsFullWithPipeNumber)).toEqual(['hi', {test: 2}, 77, {brand: 'Pipe', value: 5}])
    expect(pipeInjects(injectsOnlyPipeNumber)).toEqual([{brand: 'Pipe', value: 5}])
  })

})
