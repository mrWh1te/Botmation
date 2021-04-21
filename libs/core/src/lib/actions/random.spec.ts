import { Page } from 'puppeteer'
import { randomDecimal, rollDice, probably } from './random'

jest.mock('./inject', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('./inject')

  return {
    ...originalModule,
    inject: jest.fn(originalModule.inject)
  }
})

jest.mock('./errors', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('./errors')

  return {
    ...originalModule,
    errors: jest.fn(originalModule.errors)
  }
})

jest.mock('../helpers/random', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../helpers/random')

  return {
    ...originalModule,
    generateRandomDecimal: jest.fn(() => .45)
  }
})
/**
 * @description   Random BotActions
 */
describe('[Botmation] actions/random', () => {

  let mockPage: Page
  let mockAction, mockAction2

  beforeEach(() => {
    mockPage = {
      click: jest.fn(),
      keyboard: {
        type: jest.fn()
      },
      url: jest.fn(() => ''),
      goto: jest.fn()
    } as any as Page

    mockAction = jest.fn(() => Promise.resolve())
    mockAction2 = jest.fn(() => Promise.resolve())
  })

  // Clean up
  afterAll(async() => {
    jest.unmock('./inject')
    jest.unmock('./errors')
    jest.unmock('../helpers/random')
  })

  //
  // probably()() unit test
  it('probably()() should calculate a random decimal and if its less than or equal to the probability provided, then run the assembled BotActions otherwise do not run them', async() => {
    await probably(.36)(mockAction, mockAction2)(mockPage)

    expect(mockAction).not.toHaveBeenCalled()
    expect(mockAction2).not.toHaveBeenCalled()

    await probably(.87)(mockAction, mockAction2)(mockPage)

    expect(mockAction).toHaveBeenCalledTimes(1)
    expect(mockAction2).toHaveBeenCalledTimes(1)

    const mockOverloadGenerateRandomDecimal = jest.fn(() => 0.9)
    await probably(.3, mockOverloadGenerateRandomDecimal)(mockAction, mockAction2)(mockPage)

    expect(mockOverloadGenerateRandomDecimal).toHaveBeenNthCalledWith(1)
    expect(mockAction).toHaveBeenCalledTimes(1)
    expect(mockAction2).toHaveBeenCalledTimes(1)

    await probably()(mockAction, mockAction2)(mockPage)

    expect(mockAction).toHaveBeenCalledTimes(2)
    expect(mockAction2).toHaveBeenCalledTimes(2)
  })

  it('probably()() has a default helper method with pseudorandom decimal generator and supports overloading that with an injected function or HO function. HO function has precedence over injected.', async() => {
    const injectedRandomFunction = jest.fn(() => .8)
    const higherOrderRandomFunction = jest.fn(() => .05)

    await probably(.12)(mockAction, mockAction2)(mockPage, injectedRandomFunction)

    expect(injectedRandomFunction).toHaveBeenCalledTimes(1)
    expect(mockAction).not.toHaveBeenCalled()
    expect(mockAction2).not.toHaveBeenCalled()

    await probably(.12, higherOrderRandomFunction)(mockAction, mockAction2)(mockPage, injectedRandomFunction)

    expect(higherOrderRandomFunction).toHaveBeenCalledTimes(1)
    expect(injectedRandomFunction).toHaveBeenCalledTimes(1)
    expect(mockAction).toHaveBeenCalled()
    expect(mockAction2).toHaveBeenCalled()
  })

  //
  // randomDecimal() integration test
  it('randomDecimal()() should integrate with inject()() and errors()() in order to assemble functionality of providing a generate random decimal function', async() => {
    const randomDecimalInjectedFunction = jest.fn(() => .78)

    await randomDecimal(randomDecimalInjectedFunction)(rollDice()())(mockPage)

    const {inject: mockInjectMethod} = require('./inject')
    const {errors: mockErrorsMethod} = require('./errors')

    expect(mockInjectMethod).toHaveBeenCalledTimes(1)
    expect(mockInjectMethod).toHaveBeenCalledWith(expect.any(Function))
    expect(randomDecimalInjectedFunction).toHaveBeenCalledTimes(1)

    expect(mockErrorsMethod).toHaveBeenCalledTimes(1) // todo similar integration tests with other functions that rely on errors() ie files()()
    expect(mockErrorsMethod).toHaveBeenCalledWith('randomDecimal()()')
  })

  //
  // rollDice() integration test
  it('rollDice() should roll dice and if the correct number to roll appears, than the assembled actions are ran, otherwise the assembled actions are skipped', async() => {
    // actions will run
    await rollDice(2)(mockAction, mockAction2)(mockPage)

    expect(mockAction).toHaveBeenCalled()
    expect(mockAction2).toHaveBeenCalled()

    // actions wont run
    await rollDice(20)(mockAction, mockAction2)(mockPage)

    expect(mockAction).toHaveBeenCalledTimes(1)
    expect(mockAction2).toHaveBeenCalledTimes(1)

    //
    const mockOverloadGenerateRandomDecimal = jest.fn(() => .2)

    await rollDice(100, mockOverloadGenerateRandomDecimal)(mockAction, mockAction2)(mockPage)

    expect(mockOverloadGenerateRandomDecimal).toHaveBeenCalledTimes(1)
    expect(mockAction).toHaveBeenCalledTimes(1)
    expect(mockAction2).toHaveBeenCalledTimes(1)
  })

})
