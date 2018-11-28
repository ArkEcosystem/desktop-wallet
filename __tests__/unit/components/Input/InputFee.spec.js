import { merge } from 'lodash'
import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import { V1 } from '@config'
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
      avgFee: 0.0048 * Math.pow(10, 8),
      maxFee: 0.012 * Math.pow(10, 8),
      minFee: 0.0006 * Math.pow(10, 8)
    })
  })

  const mountComponent = config => {
    return shallowMount(InputFee, merge({
      i18n,
      propsData: {
        currency: mockNetwork.token,
        transactionType: 0
      },
      mocks: {
        session_network: mockNetwork,
        $store: store,
        $v: {
          fee: {
            $touch: jest.fn()
          }
        }
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

  describe('maxV1fee', () => {
    it('should uses V1 configuration', () => {
      let wrapper = mountComponent()
      expect(wrapper.vm.maxV1fee).toEqual(V1.fees[0] * Math.pow(10, -8))
      expect(wrapper.vm.maxV1fee).toEqual(0.1)

      wrapper = mountComponent({
        propsData: { transactionType: 3 }
      })
      expect(wrapper.vm.maxV1fee).toEqual(V1.fees[3] * Math.pow(10, -8))
    })
  })

  describe('rangePercentage', () => {
    it('should calculate the current fee percentage related to the minimum and maximum', () => {
      const wrapper = mountComponent()

      wrapper.vm.feeChoices.MINIMUM = 1
      wrapper.vm.feeChoices.MAXIMUM = 11
      wrapper.vm.fee = 6
      expect(wrapper.vm.rangePercentage).toEqual(50)

      wrapper.vm.feeChoices.MINIMUM = 0.00000001
      wrapper.vm.feeChoices.MAXIMUM = 25
      wrapper.vm.fee = 12.5
      expect(wrapper.vm.rangePercentage).toEqual(49.99999998)
    })

    describe('when the fee is smaller than the minimum', () => {
      it('should return 0%', () => {
        const wrapper = mountComponent()

        wrapper.vm.feeChoices.MINIMUM = 1
        wrapper.vm.feeChoices.MAXIMUM = 10
        wrapper.vm.fee = 0.3
        expect(wrapper.vm.rangePercentage).toEqual(0)
      })
    })

    describe('when the fee is bigger than the maximum', () => {
      it('should return 100%', () => {
        const wrapper = mountComponent()

        wrapper.vm.feeChoices.MINIMUM = 0.1
        wrapper.vm.feeChoices.MAXIMUM = 1
        wrapper.vm.fee = 2
        expect(wrapper.vm.rangePercentage).toEqual(100)
      })
    })
  })

  describe('isStaticFee', () => {
    it('should be `true` if the current fee matches, average and maximum fee are the same', () => {
      let wrapper = mountComponent()

      wrapper.vm.fee = 1
      wrapper.vm.feeChoices.AVERAGE = 1
      wrapper.vm.feeChoices.MAXIMUM = 1
      expect(wrapper.vm.isStaticFee).toBeTrue()

      wrapper.vm.feeChoices.AVERAGE = 2
      expect(wrapper.vm.isStaticFee).toBeFalse()

      wrapper.vm.fee = 2
      wrapper.vm.feeChoices.AVERAGE = 1
      expect(wrapper.vm.isStaticFee).toBeFalse()

      wrapper.vm.feeChoices.MINIMUM = 1
      wrapper.vm.feeChoices.MAXIMUM = 2
      expect(wrapper.vm.isStaticFee).toBeFalse()
    })
  })

  describe('setFee', () => {
    it('should establish the fee, as String', () => {
      const wrapper = mountComponent()

      wrapper.vm.setFee(97)
      expect(wrapper.vm.fee).toEqual('97')
      wrapper.vm.setFee('97')
      expect(wrapper.vm.fee).toEqual('97')
      wrapper.vm.setFee(Math.pow(10, -5))
      expect(wrapper.vm.fee).toEqual('0.00001')
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
  })

  describe('emitFee', () => {
    it('should emit the fee value, as Number', () => {
      const wrapper = mountComponent()

      wrapper.vm.emitFee('97')
      expect(wrapper.emitted('input')[0][0]).toBeNumber()
    })
  })

  describe('prepareFeeStatistics', () => {
    describe('when the average fee of the network is more than the V1 fee', () => {
      beforeEach(() => {
        store.getters['network/feeStatisticsByType'] = type => ({
          avgFee: 1000 * Math.pow(10, 8),
          maxFee: 0.03 * Math.pow(10, 8),
          minFee: 0.0006 * Math.pow(10, 8)
        })
      })

      it('should use the V1 fee as average always', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.feeChoices.AVERAGE).toEqual(0.1)
      })
    })

    describe('when the average fee of the network is less than the V1 fee', () => {
      beforeEach(() => {
        store.getters['network/feeStatisticsByType'] = type => ({
          avgFee: 0.0048 * Math.pow(10, 8),
          maxFee: 0.03 * Math.pow(10, 8),
          minFee: 0.0006 * Math.pow(10, 8)
        })
      })

      it('should use it as average', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.feeChoices.AVERAGE).toBeWithin(0.0048, 0.0048000001)
      })
    })

    describe('when the maximum fee of the network is more than the V1 fee', () => {
      beforeEach(() => {
        store.getters['network/feeStatisticsByType'] = type => ({
          avgFee: 0.0048 * Math.pow(10, 8),
          maxFee: 1000 * Math.pow(10, 8),
          minFee: 0.0006 * Math.pow(10, 8)
        })
      })

      it('should use the V1 fee as maximum always', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.feeChoices.MAXIMUM).toEqual(0.1)
      })
    })

    describe('when the maximum fee of the network is less than the V1 fee', () => {
      beforeEach(() => {
        store.getters['network/feeStatisticsByType'] = type => ({
          avgFee: 0.0048 * Math.pow(10, 8),
          maxFee: 0.03 * Math.pow(10, 8),
          minFee: 0.0006 * Math.pow(10, 8)
        })
      })

      it('should use it as maximum', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.feeChoices.MAXIMUM).toBeWithin(0.03, 0.03000001)
      })
    })
  })
})
