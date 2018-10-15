import { merge } from 'lodash'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { mount } from '@vue/test-utils'
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

      expect(wrapper.emitted('input')[0][0]).toEqual('99')
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
})
