import { merge } from 'lodash'
import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import { useI18n } from '../../__utils__/i18n'
import { InputFee } from '@/components/Input'
import store from '@/store'

jest.mock('@/store', () => {
  return {
    getters: {
      'session/network': jest.fn(),
      'network/feeStatisticsByType': jest.fn()
    }
  }
})

const i18n = useI18n(Vue)

describe('InputFee', () => {
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
    store.getters['network/feeStatisticsByType'] = type => ({
      avgFee: 0.0048,
      maxFee: 0.012,
      minFee: 0.0006
    })
  })

  const mountComponent = config => {
    return shallowMount(InputFee, merge({
      i18n,
      propsData: {
        currency: mockNetwork.token,
        value: '',
        transactionType: 0
      },
      mocks: {
        session_network: mockNetwork,
        $store: store
      }
    }, config))
  }

  it('has the right name', () => {
    const wrapper = mountComponent()
    expect(wrapper.name()).toEqual('InputFee')
  })

  it('should render', () => {
    const wrapper = mountComponent()
    expect(wrapper.contains('.InputFee')).toBeTruthy()
  })

  describe('setFee', () => {
    it('should establish the fee, as Number', () => {
      const wrapper = mountComponent()

      wrapper.vm.setFee(97)
      expect(wrapper.vm.fee).toEqual(97)
      wrapper.vm.setFee('97')
      expect(wrapper.vm.fee).toEqual(97)
      wrapper.vm.setFee(Math.pow(10, -5))
      expect(wrapper.vm.fee).toEqual(0.00001)
    })

    describe('when the value cannot be represented accurately', () => {
      it('should establish the fee, as String', () => {
        const wrapper = mountComponent()

        wrapper.vm.setFee(Math.pow(10, -8))
        expect(wrapper.vm.fee).toEqual('0.00000001')
        wrapper.vm.setFee(Math.pow(10, -7))
        expect(wrapper.vm.fee).toEqual('0.0000001')
        wrapper.vm.setFee('1e-8')
        expect(wrapper.vm.fee).toEqual('0.00000001')
      })
    })

    it('should emit the fee value', () => {
      const wrapper = mountComponent()

      wrapper.vm.setFee(97)
      expect(wrapper.emitted('input')[0][0]).toEqual(97)
    })
  })
})
