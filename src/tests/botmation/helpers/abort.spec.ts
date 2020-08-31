import { createAbortLineSignal } from 'botmation/helpers/abort'

/**
 * @description   Abort Helpers
 */
describe('[Botmation] helpers/abort', () => {
  
  //
  // Unit Test
  it('createAbortLineSignal() creates a `AbortLineSignal` object with safe intuitive defaults if no params are provided to set the object\'s values', () => {
    const noParams = createAbortLineSignal()
    const overrideSafeDefaultsWithThoseValues = createAbortLineSignal(1, undefined)
    const fiveAssembledLines = createAbortLineSignal(5)
    const assembledLinesWithPipeValue = createAbortLineSignal(20, 'test-createabortlinesignal-pipe-value')

    // special case, for completion sakes, negative numbers are flipped to their positive via absolute value
    const negative10 = createAbortLineSignal(-10) // it's not advisable to use negative numbers, but given the type of the param, it's more complete

    expect(noParams).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 1
    })
    expect(overrideSafeDefaultsWithThoseValues).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 1
    })
    expect(fiveAssembledLines).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 5
    })
    expect(assembledLinesWithPipeValue).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 20,
      pipeValue: 'test-createabortlinesignal-pipe-value'
    })

    // special case
    expect(negative10).toEqual({
      brand: 'Abort_Signal',
      assembledLines: 10
    })
  })

})
