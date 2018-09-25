import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import CurrencyMixin from '@/mixins/currency'

describe('Mixins > Currency', () => {
  const defaultLocale = 'en-US'
  const network = {
    token: 'NET',
    symbol: '×',
    fractionDigits: 8
  }

  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()

    localVue.use(VueI18n)

    const i18n = new VueI18n({
      locale: defaultLocale,
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
          }
        },
        'es-ES': {
          currency: {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol'
          }
        }
      }
    })

    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    wrapper = shallowMount(TestComponent, {
      localVue,
      i18n,
      mixins: [CurrencyMixin],
      mocks: {
        $store: {
          getters: {
            'session/currentNetwork': network,
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

    describe('when a `currencyFrom` option with value "session" is provided', () => {
      it('should display the symbol currency of the current network', () => {
        const amount = 1.00035

        expect(format(amount, { currencyFrom: 'network' })).toEqual('×1.00035')
      })

      it('should use the i18n locale', () => {
        const amount = Math.pow(10, 4) + Math.pow(10, -8)

        expect(format(amount, { currencyFrom: 'network' })).toEqual('×10,000.00000001')

        // NOTE: this is not going to work when tested on Node (https://github.com/nodejs/node/issues/8818)
        // although this assertion would work on browsers
        // wrapper.vm.$i18n.locale = 'es-ES'
        // expect(format(amount, { currencyFrom: 'network' })).toEqual('10.000,001 ×')
      })
    })

    describe('when a `currencyFrom` option with value "session" is provided', () => {
      it('should use the currency of the current session', () => {
        const amount = Math.pow(10, 4) + Math.pow(10, -5)

        wrapper.vm.$store.getters['session/currency'] = 'BTC'

        expect(format(amount, { currencyFrom: 'session' })).toEqual('Ƀ10,000.00001')

        wrapper.vm.$store.getters['session/currency'] = 'EUR'

        expect(format(amount, { currencyFrom: 'session' })).toEqual('€10,000.00')
      })
    })

    describe('when a `currency` option is provided', () => {
      it('should use the symbol of that currency', () => {
        const amount = Math.pow(10, 5) + Math.pow(10, -5)

        expect(format(amount, { currency: 'BTC' })).toEqual('Ƀ100,000.00001')
        expect(format(amount, { currency: 'EUR' })).toEqual('€100,000.00')
      })
    })

    describe('when a `currencyDisplay` option is provided', () => {
      it('should use it to display the currency', () => {
        const amount = 9835.387653

        expect(format(amount, { currencyFrom: 'network', currencyDisplay: 'code' })).toEqual('NET9,835.387653')
        expect(format(amount, { currency: 'EUR', currencyDisplay: 'symbol' })).toEqual('€9,835.39')
      })
    })

    it('should work with big quantities', () => {
      let amount = Math.pow(10, 12) + 0.01

      expect(format(amount, { currencyFrom: 'network' })).toEqual('×1,000,000,000,000.01')

      amount = Number.MAX_SAFE_INTEGER - 2// 9007199254740989

      expect(format(amount, { currency: 'EUR' })).toEqual('€9,007,199,254,740,989.00')
    })
  })

  describe('subToUnit', () => {
    let subToUnit
    beforeEach(() => {
      subToUnit = wrapper.vm.currency_subToUnit.bind(wrapper.vm)
    })

    it('should convert an amount from arktoshi to ARK', () => {
      let amount = Math.pow(10, 9)

      expect(subToUnit(amount)).toEqual('10')

      amount = Math.pow(10, 12) + 9800 + 1

      expect(subToUnit(amount)).toEqual('10000.00009801')
    })
  })
})
