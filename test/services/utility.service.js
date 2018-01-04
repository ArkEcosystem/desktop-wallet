'use strict'

describe('utilityService', () => {
  const tokenName = 'test-ark'
  const arktoshiUnit = Math.pow(10, 8)
  let utilityService
  let networkServiceMock

  beforeEach(() => {
    module('arkclient.services', $provide => {
      networkServiceMock = { getNetwork: sinon.stub().returns({ version: 0x17, token: tokenName }) }

      // inject the mock services
      $provide.value('networkService', networkServiceMock)
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

    it('1 arktoshi is 1 Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit)

      expect(ark).to.eql(1)
    })

    it('1/2 arktoshi is 0.5 Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 2)

      expect(ark).to.eql(0.5)
    })

    it('1111111 part of arktoshi is human readable amount of Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 1111111)

      expect(ark).to.eq('0.000000900000090000009')
    })

    it('1111111 part of arktoshi is precise amount of Ark', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit / 1111111, true)

      expect(ark).to.be.within(9.00000090000000e-7, 9.00000090000009e-7)
    })

    it('1 arktoshi is 1 test-ark (include network token)', () => {
      const ark = utilityService.arktoshiToArk(arktoshiUnit, false, true)

      expect(ark).to.eql('1 ' + tokenName)
    })
  })
})
