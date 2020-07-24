import { isPipe } from 'botmation/interfaces'
import { createEmptyPipe, wrapValueInPipe } from 'botmation/helpers/pipe'

/**
 * @description   Pipe related Interfaces
 *                Sometimes interfaces have type gaurds (functions) with them, since it makes sense to put what a "type gaurd" gaurds with each other
 */
describe('[Botmation] interfaces/pipe', () => {

/**
 * @description    Type Gaurd for Piped values (values branded as `Pipe`)
 * @param value 
 */

  //
  // Unit Tests
  it('isPipe() is a Type Gaurd for the Pipe interface that checks to see if the variable has a `brand` key properly valued, determining the provided value (variable) is a Pipe', async () => {
    // safety checks
    const isPipeUndefined = isPipe(undefined)
    const isPipeFalse = isPipe(false)
    const isPipeTrue = isPipe(true)
    const isPipeString = isPipe('some string')
    const isPipeNumber = isPipe(5)
    const isPipeEmptyObject = isPipe({})
    const isPipeFunction = isPipe(() => {})

    // empty pipe checks
    const isPipeEmptyPipe = isPipe(createEmptyPipe())
    const isPipeEmptyPipeManual = isPipe({brand: 'Pipe'})

    // brand checks
    const isPipeObjectNoBrand = isPipe({value: 'test'})
    const isPipeObjectWithWrongBrand = isPipe({brand: 'not a Pipe'})

    // actual pipe checks
    const isPipePipe = isPipe(wrapValueInPipe()) // technically empty pipe
    const isPipePipeNumber = isPipe(wrapValueInPipe(5))
    const isPipePipeString = isPipe(wrapValueInPipe('hello')) // Pipe supports value of PipeValue which is any normal data value type, so going to exclude further testing of types of value if presented since it's not valuable

    // safety checks, a Pipe, at minimum, is a wrapped object with a brand as 'Pipe'
    expect(isPipeUndefined).toEqual(false)
    expect(isPipeFalse).toEqual(false)
    expect(isPipeTrue).toEqual(false)
    expect(isPipeString).toEqual(false)
    expect(isPipeNumber).toEqual(false)
    expect(isPipeEmptyObject).toEqual(false)
    expect(isPipeFunction).toEqual(false)

    // empty pipe checks
    expect(isPipeEmptyPipe).toEqual(true)
    expect(isPipeEmptyPipeManual).toEqual(true)

    // brand checks
    expect(isPipeObjectNoBrand).toEqual(false)
    expect(isPipeObjectWithWrongBrand).toEqual(false)

    // pipe's with values checks
    expect(isPipePipe).toEqual(true)
    expect(isPipePipeNumber).toEqual(true)
    expect(isPipePipeString).toEqual(true)
  })

})
