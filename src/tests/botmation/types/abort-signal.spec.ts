import { isAbortLineSignal, AbortLineSignal } from 'botmation/types/abort-signal'
import { wrapValueInPipe } from 'botmation/helpers/pipe'

/**
 * @description   AbortLineSignal Type guard function
 */
describe('[Botmation] types/abort-signal', () => {

  //
  // Unit Test
  it('isAbortLineSignal() returns boolean true if the provided param is an Object that matches the minimum requirements for the AbortLineSignal interface', () => {
    // pass
    const abortLineSignalObj: AbortLineSignal = {
      brand: 'Abort_Signal',
      assembledLines: 1
    }
    const abortLineSignalObjWithPipeValue: AbortLineSignal = {
      brand: 'Abort_Signal',
      assembledLines: 25,
      pipeValue: 'some val'
    }
    
    // fails
    const pipeObject = wrapValueInPipe('hey')
    const likeAbortLineSignalButString = {
      brand: 'Abort_Signal',
      assembledLines: '1'
    }
    const likeAbortLineSignalButWrongBrand = {
      brand: 'Abort_Signal_',
      assembledLines: 1
    }

    // pass
    expect(isAbortLineSignal(abortLineSignalObj)).toEqual(true)
    expect(isAbortLineSignal(abortLineSignalObjWithPipeValue)).toEqual(true)
    
    // fail
    expect(isAbortLineSignal(pipeObject)).toEqual(false)
    expect(isAbortLineSignal(likeAbortLineSignalButString)).toEqual(false)
    expect(isAbortLineSignal(likeAbortLineSignalButWrongBrand)).toEqual(false)
  })

})
