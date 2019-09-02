import { createLocalVue, shallowMount } from '@vue/test-utils'
import useI18n from '../__utils__/i18n'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'

describe('Mixins > Formatter', () => {
  const network = {
    token: 'NET',
    symbol: '×',
    fractionDigits: 8
  }

  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()
    const i18n = useI18n(localVue)

    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    wrapper = shallowMount(TestComponent, {
      localVue,
      i18n,
      mixins: [CurrencyMixin, FormatterMixin],
      mocks: {
        session_network: network,
        $store: {
          getters: {
            'session/currency': 'BTC'
          }
        }
      }
    })
  })

  describe('formatter_percentage', () => {
    describe('when a number is provided', () => {
      it('should return it as percentage', () => {
        expect(wrapper.vm.formatter_percentage(97.54)).toEqual('97.54%')
        expect(wrapper.vm.formatter_percentage(97)).toEqual('97.00%')
        expect(wrapper.vm.formatter_percentage(97.1)).toEqual('97.10%')
        expect(wrapper.vm.formatter_percentage(0)).toEqual('0.00%')
      })
    })
  })

  describe('formatter_networkCurrency', () => {
    describe('when a number is provided', () => {
      it('should return it as percentage', () => {
        expect(wrapper.vm.formatter_networkCurrency(10000000)).toEqual('×\xa00.10')
        expect(wrapper.vm.formatter_networkCurrency(100000000)).toEqual('×\xa01.00')
        expect(wrapper.vm.formatter_networkCurrency(1000000000)).toEqual('×\xa010.00')
        expect(wrapper.vm.formatter_networkCurrency(0)).toEqual('×\xa00.00')
      })
    })
  })

  describe('formatter_votes', () => {
    describe('when a number is provided', () => {
      it('should return it as percentage', () => {
        expect(wrapper.vm.formatter_votes(100000001)).toEqual('1')
        expect(wrapper.vm.formatter_votes(1000000001)).toEqual('10')
        expect(wrapper.vm.formatter_votes(1111111111)).toEqual('11.11')
        expect(wrapper.vm.formatter_votes(0)).toEqual('0')
      })
    })
  })
})
