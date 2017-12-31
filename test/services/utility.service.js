'use strict'

describe('utilityService',() => {

  let utilityService, ARK_LAUNCH_DATE, ARKTOSHI_UNIT

  beforeEach(module('arkclient.constants'));

  beforeEach(() => {
    module('arkclient.services')

    inject(($injector, _$rootScope_, _ARK_LAUNCH_DATE_, _ARKTOSHI_UNIT_) => {
      utilityService = $injector.get('utilityService')
      ARK_LAUNCH_DATE = _ARK_LAUNCH_DATE_
      ARKTOSHI_UNIT = _ARKTOSHI_UNIT_
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
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT)

      expect(ark).to.eql(1)
    })

    it('1/2 arktoshiUnit is 0.5 Ark', () => {
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT / 2)

      expect(ark).to.eql(0.5)
    })

    it('1111111 part of arktoshiUnit is human readable amount of Ark', () => {
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT / 1111111)

      expect(ark).to.eq('0.000000900000090000009')
    })

    it('1111111 part of arktoshiUnit is human readable amount of Ark, 0 decimals', () => {
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT / 1111111, false, 0)

      expect(ark).to.eq('0')
    })

    it('1111111 part of arktoshiUnit is human readable amount of Ark, 7 decimals', () => {
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT / 1111111, false, 7)

      expect(ark).to.eq('0.0000009')
    })

    it('11111111 part of arktoshi is precise amount of Ark', () => {
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT / 11111111, true)

      expect(ark).to.be.within(9.00000009000000e-8, 9.00000009000002e-8)
    })

    it('11111111 part of arktoshi is precise amount of Ark, 0 decimals', () => {
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT / 11111111, true, 0)

      expect(ark).to.eq('0')
    })

    it('11111111 part of arktoshi is precise amount of Ark, 7 decimals', () => {
      const ark = utilityService.arktoshiToArk(ARKTOSHI_UNIT / 11111111, true, 7)

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

      expect(ark).to.eql(ARKTOSHI_UNIT)
    })

    it('0.5 Ark is 0.5 arktoshiUnit', () => {
      const ark = utilityService.arkToArktoshi(0.5)

      expect(ark).to.eql(ARKTOSHI_UNIT / 2)
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

  describe('getArkRelativeTimeStamp', () => {
    it('input ist not defined, returns null', () => {
      expect(utilityService.getArkRelativeTimeStamp()).to.eq(null)
      expect(utilityService.getArkRelativeTimeStamp(null)).to.eq(null)
    })

    it('input is ark launch time, returns 0', () => {
      expect(utilityService.getArkRelativeTimeStamp(ARK_LAUNCH_DATE)).to.eq(0)
    })

    it('input is BEFORE ark launch time, returns null', () => {
      expect(utilityService.getArkRelativeTimeStamp(new Date(Date.UTC(2017, 2, 21, 12, 59, 59, 59)))).to.eq(null)
    })

    it('input is a utc date, returns correct timestamp', () => {
      expect(utilityService.getArkRelativeTimeStamp(new Date(Date.UTC(2017, 10, 10, 10, 0, 0, 0)))).to.eq(20206800)
    })

    it('input is a local date, returns correct timestamp', () => {
      // since this is plus 1, this means that in UTC, it's currently 09:00, therefore the timestamphas to be 1 hour shorter than the one above
      const localDate = new Date("Fri Nov 10 2017 10:00:00 GMT+0100 (Romance Standard Time)")
      const oneHourInSeconds = 60 * 60
      expect(utilityService.getArkRelativeTimeStamp(localDate)).to.eq(20206800 - oneHourInSeconds)
    })
  })

  describe('getDate', () => {
    it('input ist not a number, returns null', () => {
      expect(utilityService.getDate()).to.eq(null)
      expect(utilityService.getDate(null)).to.eq(null)
      expect(utilityService.getDate('abc')).to.eq(null)
      expect(utilityService.getDate({})).to.eq(null)
    })

    it('input is 0, returns ark launch date', () => {
      expect(utilityService.getDate(0).getTime()).to.eq(ARK_LAUNCH_DATE.getTime())
    })

    it('input is lower than 0, returns null', () => {
      expect(utilityService.getDate(-1)).to.eq(null)
    })

    it('input is a normal timestamp, returns correct date', () => {
      expect(utilityService.getDate(20206800).getTime()).to.eq(new Date(Date.UTC(2017, 10, 10, 10, 0, 0, 0)).getTime())
    })
  })
})
