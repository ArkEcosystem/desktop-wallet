'use strict'

describe('utilityService',() => {

  const arktoshiUnit = Math.pow(10, 8)
  let utilityService

  beforeEach(() => {
    module('arkclient.services', $provide => {
      // inject the mock services
      $provide.value('ARKTOSHI_UNIT', arktoshiUnit)
    })

    inject(($injector, _$rootScope_) => {
      utilityService = $injector.get('utilityService')
    })
  })

  describe('arktoshiToArk', () => {

    it('undefined arktoshi is 0 Ark', () => {
      const ark = utilityService.arktoshiToArk()

      expect(ark).to.eql(0)
    })

    it('0 arktoshi is 0 Ark', () => {
      const ark = utilityService.arktoshiToArk(0)

      expect(ark).to.eql(0)
    })

    it('1 arktoshiUnit is 1 Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit)

      expect(ark).to.eql(1)
    })

    it('1/2 arktoshiUnit is 0.5 Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 2)

      expect(ark).to.eql(0.5)
    })

    it('1111111 part of arktoshiUnit is human readable amount of Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 1111111)

      expect(ark).to.eq('0.000000900000090000009')
    })

    it('1111111 part of arktoshiUnit is human readable amount of Ark, 0 decimals', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 1111111, false, 0)

      expect(ark).to.eq('0')
    })

    it('1111111 part of arktoshiUnit is human readable amount of Ark, 7 decimals', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 1111111, false, 7)

      expect(ark).to.eq('0.0000009')
    })

    it('11111111 part of arktoshi is precise amount of Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 11111111, true)

      expect(ark).to.be.within(9.00000009000000e-8, 9.00000009000002e-8)
    })

    it('11111111 part of arktoshi is precise amount of Ark, 0 decimals', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 11111111, true, 0)

      expect(ark).to.eq('0')
    })

    it('11111111 part of arktoshi is precise amount of Ark, 7 decimals', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 11111111, true, 7)

      expect(ark).to.eq('0.0000001')
    })
  })

  describe('arkToArktoshi', () => {
    it('undefined Ark is 0 arktoshi', () => {
      const ark = utilityService.arkToArktoshi()

      expect(ark).to.eql(0)
    })

    it('0 Ark is 0 arktoshi', () => {
      const ark = utilityService.arkToArktoshi(0)

      expect(ark).to.eql(0)
    })

    it('1 Ark is 1 arktoshiUnit', () => {
      const ark = utilityService.arkToArktoshi(1)

      expect(ark).to.eql(arktoshiUnit)
    })

    it('0.5 Ark is 0.5 arktoshiUnit', () => {
      const ark = utilityService.arkToArktoshi(0.5)

      expect(ark).to.eql(arktoshiUnit / 2)
    })

    it('11.11111111111 ark is correct arktoshi amount', () => {
      const ark = utilityService.arkToArktoshi(11.11111111111)

      expect(ark).to.eq(1111111111.111)
    })

    it('11.11111111111 ark is correct arktoshi amount, 0 decimals', () => {
      const ark = utilityService.arkToArktoshi(11.11111111111, 0)

      expect(ark).to.eq('1111111111')
    })

    it('11.11111111111 ark is correct arktoshi amount, 2 decimals', () => {
      const ark = utilityService.arkToArktoshi(11.11111111111, 2)

      expect(ark).to.eq('1111111111.11')
    })
  })

  describe('numberStringToFixed', () => {
    it('input is not a string, returns input value', () => {
      expect(utilityService.numberStringToFixed()).to.eq()
      expect(utilityService.numberStringToFixed(null)).to.eq(null)
      expect(utilityService.numberStringToFixed(1)).to.eq(1)
      const obj = {}
      expect(utilityService.numberStringToFixed(obj)).to.eq(obj)
    })

    it('12.345, no value for decimals, returns input', () => {
      expect(utilityService.numberStringToFixed('12.345')).to.eq('12.345')
    })

    it('12.345, 0 decimals, returns 12', () => {
      expect(utilityService.numberStringToFixed('12.345', 0)).to.eq('12')
    })

    it('12.345, 2 decimals, returns 12.34', () => {
      expect(utilityService.numberStringToFixed('12.345', 2)).to.eq('12.34')
    })

    it('12.345, 4 decimals, returns 12.3450', () => {
      expect(utilityService.numberStringToFixed('12.345', 4)).to.eq('12.3450')
    })

    it('12, 2 decimals, returns 12.00', () => {
      expect(utilityService.numberStringToFixed('12', 2)).to.eq('12.00')
    })
  })
})
