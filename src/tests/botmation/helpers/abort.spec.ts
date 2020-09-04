import { createAbortLineSignal, processAbortLineSignal } from 'botmation/helpers/abort'

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

  it('processAbortLineSignal() will returna new AbortLineSignal object as if processed for default 1 line of assembly and for overriden special cases of multi-aborting', () => {
    const abortLineSignalInfinity = createAbortLineSignal(0)
    expect(processAbortLineSignal(abortLineSignalInfinity))
      .toEqual({brand: 'Abort_Signal', assembledLines: 0})

    const abortLineSignalOne = createAbortLineSignal(1, 'kitty')
    expect(processAbortLineSignal(abortLineSignalOne))
      .toEqual('kitty')

    const abortLineSignalMulti = createAbortLineSignal(7)
    expect(processAbortLineSignal(abortLineSignalMulti))
      .toEqual({brand: 'Abort_Signal', assembledLines: 6})

    const abortLineSignalMultiReduceMulti = createAbortLineSignal(7)
    expect(processAbortLineSignal(abortLineSignalMultiReduceMulti, 3))
      .toEqual({brand: 'Abort_Signal', assembledLines: 4})

    // in this case, we are trying to reduce the assembledLines by a value greater than what exists
    // leading to a negative number, this abortlinesignal helpers try to avoid this from using absolute value to this case:
    const abortLineSignalMultiFewReduceMultiMore = createAbortLineSignal(4, 'puppy')
    expect(processAbortLineSignal(abortLineSignalMultiFewReduceMultiMore, 9))
      .toEqual('puppy') // return pipeValue when negative so if no pipeValue then undefined

    const abortLineSignalMultiFewReduceMultiMoreNoPipe = createAbortLineSignal(3)
    expect(processAbortLineSignal(abortLineSignalMultiFewReduceMultiMoreNoPipe, 8))
      .toBeUndefined() // return pipeValue when negative so if no pipeValue then undefined
  })

})
