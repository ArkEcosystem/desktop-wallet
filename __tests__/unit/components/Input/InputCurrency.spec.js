import { merge } from 'lodash'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { mount } from '@vue/test-utils'
import { useI18n } from '../../__utils__/i18n'
import { InputCurrency } from '@/components/Input'
import store from '@/store'

jest.mock('@/store', () => {
  return {
    getters: {
      'session/network': jest.fn()
    }
  }
})

Vue.use(Vuelidate)
const i18n = useI18n(Vue)

describe('InputCurrency', () => {
  let mockNetwork

  beforeEach(() => {
    mockNetwork = {
      symbol: '×',
      token: 'NET',
      market: {
        enabled: true
      }
    }

    store.getters['session/network'] = mockNetwork
  })

  const mountComponent = config => {
    return mount(InputCurrency, merge({
      i18n,
      propsData: {
        currency: mockNetwork.token,
        value: ''
      },
      mocks: {
        session_network: mockNetwork
      }
    }, config))
  }

  it('has the right name', () => {
    const wrapper = mountComponent()
    expect(wrapper.name()).toEqual('InputCurrency')
  })

  it('should render', () => {
    const wrapper = mountComponent()
    expect(wrapper.contains('.InputCurrency')).toBeTruthy()
  })

  describe('when receiving the `isDisabled` prop', () => {
    it('should be disabled', () => {
      const wrapper = mountComponent({
        propsData: { isDisabled: true }
      })
      const input = wrapper.find('.InputCurrency__input')
      expect(input.attributes().disabled).toBe('disabled')
    })
  })

  describe('when receiving the `helperText` prop', () => {
    it('should show a helper text', () => {
      const helperText = 'example text'
      const wrapper = mountComponent({
        propsData: { helperText }
      })
      const helper = wrapper.find('.InputField__helper')
      expect(helper.text()).toBe(helperText)
    })
  })

  describe('when the input value changes', () => {
    it('should emit the `input` event', () => {
      const wrapper = mountComponent()
      wrapper.find('.InputCurrency input').setValue(99)

      expect(wrapper.emitted('input')[0][0]).toEqual(99)
    })

    it('should emit the `raw` event', () => {
      const wrapper = mountComponent()
      wrapper.find('.InputCurrency input').setValue(99)

      expect(wrapper.emitted('raw')[0][0]).toEqual('99')
    })
  })

  describe('emitInput', () => {
    it('should emit 0 instead of invalid numbers', () => {
      const wrapper = mountComponent()

      wrapper.vm.emitInput('not')
      expect(wrapper.emitted('input')[0][0]).toEqual(0)

      wrapper.vm.emitInput(null)
      expect(wrapper.emitted('input')[1][0]).toEqual(0)
    })

    it('should parse and emit numeric values as Numbers', () => {
      const wrapper = mountComponent()

      wrapper.vm.emitInput(12.022)
      expect(wrapper.emitted('input')[0][0]).toEqual(12.022)

      wrapper.vm.emitInput('22.22')
      expect(wrapper.emitted('input')[1][0]).toEqual(22.22)

      wrapper.vm.emitInput('122,0122')
      expect(wrapper.emitted('input')[2][0]).toEqual(122.0122)
    })
  })

  describe('checkAmount', () => {
    it('should return `true`` on Numbers', () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.checkAmount(0)).toBeTrue()
      expect(wrapper.vm.checkAmount(19)).toBeTrue()
      expect(wrapper.vm.checkAmount(19.9999999999)).toBeTrue()
      expect(wrapper.vm.checkAmount(766619.9999999999)).toBeTrue()
    })

    it('should return `true`` on Strings that looks like numbers', () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.checkAmount('19')).toBeTrue()
      expect(wrapper.vm.checkAmount('19.9999999999')).toBeTrue()
      expect(wrapper.vm.checkAmount('766619.9999999999')).toBeTrue()
      expect(wrapper.vm.checkAmount('19,9')).toBeTrue()
      expect(wrapper.vm.checkAmount('19,999')).toBeTrue()
      expect(wrapper.vm.checkAmount('19,999.00')).toBeTrue()
      expect(wrapper.vm.checkAmount('19.999,00')).toBeTrue()
    })

    it('should return `false` on Strings that does not look like numbers', () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.checkAmount('')).toBeFalse()
      expect(wrapper.vm.checkAmount('.9')).toBeFalse()
      expect(wrapper.vm.checkAmount('19a.99')).toBeFalse()
      expect(wrapper.vm.checkAmount('766..999')).toBeFalse()
      expect(wrapper.vm.checkAmount('as97')).toBeFalse()
    })
  })

  describe('updateInputValue', () => {
    describe('when receiving an empty value', () => {
      it('should empty the input value', () => {
        const wrapper = mountComponent()
        wrapper.vm.inputValue = 10

        wrapper.vm.updateInputValue('')
        expect(wrapper.vm.inputValue).toEqual('')
      })

      it('should return `true`', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.updateInputValue('')).toBeTrue()
      })
    })

    describe('when receiving values that look like numbers', () => {
      it('should uses them on the input value', () => {
        const wrapper = mountComponent()
        wrapper.vm.inputValue = 1

        wrapper.vm.updateInputValue('10')
        expect(wrapper.vm.inputValue).toEqual('10')

        wrapper.vm.updateInputValue('1.10')
        expect(wrapper.vm.inputValue).toEqual('1.10')

        wrapper.vm.updateInputValue(1.1)
        expect(wrapper.vm.inputValue).toEqual('1.1')

        wrapper.vm.updateInputValue(1e-8)
        expect(wrapper.vm.inputValue).toEqual('0.00000001')

        wrapper.vm.updateInputValue(1e-6)
        expect(wrapper.vm.inputValue).toEqual('0.000001')

        wrapper.vm.updateInputValue('1,1')
        expect(wrapper.vm.inputValue).toEqual('1.1')

        wrapper.vm.updateInputValue('100.200.300,40')
        expect(wrapper.vm.inputValue).toEqual('100200300.40')

        wrapper.vm.updateInputValue('9,999,999.99')
        expect(wrapper.vm.inputValue).toEqual('9999999.99')

        wrapper.vm.updateInputValue('10 000 000.5')
        expect(wrapper.vm.inputValue).toEqual('10000000.5')

        wrapper.vm.updateInputValue('80 000,8')
        expect(wrapper.vm.inputValue).toEqual('80000.8')

        wrapper.vm.updateInputValue('11_111_111.11')
        expect(wrapper.vm.inputValue).toEqual('11111111.11')

        wrapper.vm.updateInputValue('33_333,33')
        expect(wrapper.vm.inputValue).toEqual('33333.33')
      })

      it('should return `true`', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.updateInputValue('10')).toBeTrue()
      })
    })

    describe('when receiving values that do not look like numbers', () => {
      it('should not change the input value', () => {
        const wrapper = mountComponent()
        wrapper.vm.inputValue = 10

        wrapper.vm.updateInputValue('not')
        expect(wrapper.vm.inputValue).toEqual(10)

        wrapper.vm.updateInputValue(null)
        expect(wrapper.vm.inputValue).toEqual(10)
      })

      it('should return `false`', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.updateInputValue('not')).toBeFalse()
        expect(wrapper.vm.updateInputValue(null)).toBeFalse()
      })
    })
  })
})
