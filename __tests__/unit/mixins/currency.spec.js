import { createLocalVue, shallowMount } from '@vue/test-utils'
import useI18n from '../__utils__/i18n'
import CurrencyMixin from '@/mixins/currency'

describe('Mixins > Currency', () => {
  const network = {
    token: 'NET',
    subunit: 'netoshi',
    symbol: '×',
    fractionDigits: 8
  }
  const networks = [
    network,
    {
      token: 'TOK',
      subunit: 'tokoshi',
      symbol: 't',
      fractionDigits: 8
    }
  ]

  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()
    const i18n = useI18n(localVue)

    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    const networkBy = (attr, value) => networks.find(network => network[attr] === value)

    wrapper = shallowMount(TestComponent, {
      localVue,
      i18n,
      mixins: [CurrencyMixin],
      mocks: {
        session_network: network,
        $store: {
          getters: {
            'network/bySymbol': symbol => networkBy('symbol', symbol),
            'network/byToken': token => networkBy('token', token),
            'session/currency': 'BTC'
          }
        }
      }
    })
  })

  describe('currency_format', () => {
    let format
    beforeEach(() => {
      format = wrapper.vm.currency_format.bind(wrapper.vm)
    })

    describe('when no `currency` or `currencyFrom` option is provided', () => {
      it('should throw an Error', () => {
        expect(() => format(1)).toThrow(Error, /currency/)
        expect(() => format(1, { currencyDisplay: 'code' })).toThrow(Error, /currency/)
      })
    })

    describe('when the `currencyFrom` option with value "network" is provided', () => {
      it('should display the symbol currency of the current network', () => {
        const amount = 1.00035

        expect(format(amount, { currencyFrom: 'network' })).toEqual('× 1.00035')
      })

      it('should use the i18n locale', () => {
        const amount = Math.pow(10, 4) + 1e-8

        expect(format(amount, { currencyFrom: 'network' })).toEqual('× 10,000.00000001')

        // NOTE: this is not going to work when tested on Node (https://github.com/nodejs/node/issues/8818)
        // although this assertion would work on browsers
        // wrapper.vm.$i18n.locale = 'es-ES'
        // expect(format(amount, { currencyFrom: 'network' })).toEqual('10.000,001 ×')
      })
    })

    describe('when the `currencyFrom` option with value "session" is provided', () => {
      it('should use the currency of the current session', () => {
        const amount = Math.pow(10, 4) + Math.pow(10, -5)

        wrapper.vm.$store.getters['session/currency'] = 'BTC'

        expect(format(amount, { currencyFrom: 'session' })).toEqual('Ƀ 10,000.00001')

        wrapper.vm.$store.getters['session/currency'] = 'EUR'

        expect(format(amount, { currencyFrom: 'session' })).toEqual('€10,000.00')
      })
    })

    describe('when the `currency` option is provided', () => {
      it('should use the symbol of that currency', () => {
        const amount = Math.pow(10, 5) + Math.pow(10, -5)

        expect(format(amount, { currency: 'BTC' })).toEqual('Ƀ 100,000.00001')
        expect(format(amount, { currency: 'EUR' })).toEqual('€100,000.00')
      })

      describe('when the symbol is not configured', () => {
        it('should throw an Error', () => {
          const amount = Math.pow(10, 5) + Math.pow(10, -5)

          expect(() => format(amount, { currency: 'NO' })).toThrow()
        })

        it('should admit it is the current network currency', () => {
          const amount = Math.pow(10, 5) + Math.pow(10, -5)

          expect(format(amount, { currency: 'NET' })).toEqual('× 100,000.00001')
        })

        it('should admit it is from any known network', () => {
          const amount = Math.pow(10, 5) + Math.pow(10, -5)

          expect(format(amount, { currency: 'TOK' })).toEqual('t 100,000.00001')
        })
      })
    })

    describe('when the `currencyDisplay` option is provided', () => {
      it('should use it to display the currency', () => {
        const amount = 9835.387653

        expect(format(amount, { currencyFrom: 'network', currencyDisplay: 'code' })).toEqual('NET 9,835.387653')
        expect(format(amount, { currency: 'EUR', currencyDisplay: 'symbol' })).toEqual('€9,835.39')
      })
    })

    describe('when the `subunit` option is provided', () => {
      describe('when the curreny is not the network currency', () => {
        it('should throw an Error', () => {
          expect(() => format(10, { currency: 'EUR', subunit: true })).toThrow(/subunit/)
        })
      })

      describe('when the curreny is not the network currency', () => {
        it('should use it to display the currency, indepently of the `currencyDisplay` option', () => {
          const amount = 9835.387653

          expect(format(amount, { currencyFrom: 'network', currencyDisplay: 'code', subunit: true })).toEqual('netoshi 983,538,765,300.00')
          expect(format(amount, { currency: 'NET', currencyDisplay: 'symbol', subunit: true })).toEqual('netoshi 983,538,765,300.00')
        })
      })
    })

    it('should work with big quantities', () => {
      let amount = Math.pow(10, 12) + 0.01

      expect(format(amount, { currencyFrom: 'network' })).toEqual('× 1,000,000,000,000.01')

      amount = Number.MAX_SAFE_INTEGER - 2// 9007199254740989

      expect(format(amount, { currency: 'EUR' })).toEqual('€9,007,199,254,740,989.00')
    })
  })

  describe('subToUnit', () => {
    let subToUnit
    beforeEach(() => {
      subToUnit = wrapper.vm.currency_subToUnit.bind(wrapper.vm)
    })

    describe('when not receiving a network', () => {
      it('should use the session network to convert an amount from arktoshi to ARK', () => {
        let amount = Math.pow(10, 9)

        expect(subToUnit(amount)).toEqual('10')

        amount = Math.pow(10, 12) + 9800 + 1

        expect(subToUnit(amount)).toEqual('10000.00009801')
      })
    })

    describe('when receiving a network', () => {
      it('should use it to convert an amount from its subunit to its unit', () => {
        const network = { fractionDigits: 3 }
        let amount = Math.pow(10, 3)

        expect(subToUnit(amount, network)).toEqual('1')

        amount = Math.pow(10, 9) + 9800 + 1

        expect(subToUnit(amount, network)).toEqual('1000009.801')
      })
    })
  })
})
