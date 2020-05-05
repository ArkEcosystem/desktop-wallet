import { merge } from 'lodash'
import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import { V1 } from '@config'
import { useI18n } from '../../__utils__/i18n'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'
import { InputFee } from '@/components/Input'
import store from '@/store'
import BigNumber from '@/plugins/bignumber'

jest.mock('@/store', () => {
  return {
    getters: {
      'transaction/staticFee': jest.fn(type => {
        switch (type) {
          case 0:
            return 10000000
          case 3:
            return 100000000
          default:
            return null
        }
      }),
      'session/lastFeeByType': jest.fn((type, typeGroup) => {
        if (typeGroup === 1) {
          switch (type) {
            case 0:
              return 10000000
            case 1:
              return undefined
            case 3:
              return 100000000
            default:
              return null
          }
        }

        return null
      })
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
      },
      feeStatistics: [{
        type: 0,
        fees: {
          avgFee: 0.1,
          maxFee: 0.4,
          minFee: 0.01
        }
      }, {
        type: 3,
        fees: {
          avgFee: 0.1,
          maxFee: 0.4,
          minFee: 0.01
        }
      }],
      fractionDigits: 8
    }

    store.getters['session/network'] = mockNetwork
    store.getters['network/byToken'] = () => mockNetwork
  })

  const mountComponent = config => {
    return shallowMount(InputFee, merge({
      i18n,
      propsData: {
        currency: mockNetwork.token,
        transactionType: 0,
        minimumAmount: new BigNumber(1e8),
        maximumAmount: new BigNumber(1e8)
      },
      mixins: [CurrencyMixin, FormatterMixin],
      mocks: {
        session_network: mockNetwork,
        wallet_fromRoute: { balance: '10' },
        $store: store,
        $synchronizer: {
          focus: jest.fn(),
          pause: jest.fn(),
          appendFocus: jest.fn(),
          removeFocus: jest.fn()
        },
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

  it('should render the fee choice buttons', () => {
    const wrapper = mountComponent()
    const buttons = wrapper.findAll('.InputFee__choice')
    expect(buttons).toHaveLength(6)
  })

  it("should not render the 'last' fee choice button when there is no last fee for a given type", () => {
    const wrapper = mountComponent({
      propsData: { transactionType: 1 }
    })
    const buttons = wrapper.findAll('.InputFee__choice')
    expect(buttons).toHaveLength(5)
  })

  it('should set the default chosen fee if available when created', () => {
    const wrapper = mountComponent({
      mocks: {
        session_profile: {
          defaultChosenFee: 'LAST'
        }
      }
    })

    expect(wrapper.vm.chosenFee).toBe('LAST')
  })

  describe('maxV1fee', () => {
    it('should uses V1 configuration', () => {
      let wrapper = mountComponent({
        propsData: { transactionType: 0 }
      })
      expect(wrapper.vm.maxV1fee).toEqual(V1.fees.GROUP_1[0])

      wrapper = mountComponent({
        propsData: { transactionType: 3 }
      })
      expect(wrapper.vm.maxV1fee).toEqual(V1.fees.GROUP_1[3])
    })
  })

  describe('rangePercentage', () => {
    const mockedComponent = (min, max) => {
      return mountComponent({
        computed: {
          feeChoiceMin: () => new BigNumber(min),
          feeChoiceMax: () => new BigNumber(max)
        }
      })
    }

    it('should calculate the current fee percentage related to the minimum and maximum', () => {
      let wrapper = mockedComponent(1, 11)
      wrapper.vm.fee = 6
      expect(wrapper.vm.rangePercentage).toEqual(50)

      wrapper = mockedComponent(0.00000001, 25)
      wrapper.vm.fee = 12.5
      expect(wrapper.vm.rangePercentage).toEqual(49.99999998)
    })

    describe('when the fee is smaller than the minimum', () => {
      it('should return 0%', () => {
        const wrapper = mockedComponent(1, 10)
        wrapper.vm.fee = 0.3
        expect(wrapper.vm.rangePercentage).toEqual(0)
      })
    })

    describe('when the fee is bigger than the maximum', () => {
      it('should return 100%', () => {
        const wrapper = mockedComponent(0.1, 1)
        wrapper.vm.fee = 2
        expect(wrapper.vm.rangePercentage).toEqual(100)
      })
    })
  })

  describe('isStaticFee', () => {
    const mockedComponent = fees => {
      return mountComponent({
        computed: {
          feeChoices: () => ({
            MINIMUM: new BigNumber(1e-8),
            INPUT: new BigNumber(1e-8),
            ADVANCED: new BigNumber(1e-8),
            ...fees
          })
        }
      })
    }

    it('should be `true` if the current fee matches, average and maximum fee are the same', () => {
      const wrapper = mockedComponent({
        AVERAGE: new BigNumber(1),
        MAXIMUM: new BigNumber(1)
      })
      wrapper.vm.fee = 1
      expect(wrapper.vm.isStaticFee).toBeTrue()
    })

    it('should be `false` if the current fee matches, average and maximum fee are not the same', () => {
      let wrapper = mockedComponent({
        AVERAGE: new BigNumber(2),
        MAXIMUM: new BigNumber(1)
      })
      wrapper.vm.fee = 1
      expect(wrapper.vm.isStaticFee).toBeFalse()

      wrapper = mockedComponent({
        AVERAGE: new BigNumber(1),
        MAXIMUM: new BigNumber(2)
      })
      wrapper.vm.fee = 1

      expect(wrapper.vm.isStaticFee).toBeFalse()
      wrapper = mockedComponent({
        AVERAGE: new BigNumber(1),
        MAXIMUM: new BigNumber(1)
      })
      wrapper.vm.fee = 2
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

        wrapper.vm.setFee(1e-8)
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
      expect(wrapper.emitted('input')[0][0]).toBeString()
    })
  })

  describe('prepareFeeStatistics', () => {
    describe('when any fee of the network is more than the V1 max fee', () => {
      beforeEach(() => {
        mockNetwork.feeStatistics = [{
          type: 0,
          fees: {
            avgFee: 900 * 1e8,
            maxFee: 1000 * 1e8,
            minFee: 800 * 1e8
          }
        }]
      })

      it('should use the V1 max fee', () => {
        const wrapper = mountComponent()

        const maxV1fee = new BigNumber(wrapper.vm.maxV1fee * 1e-8)

        expect(wrapper.vm.feeChoices.MAXIMUM).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.MAXIMUM).toEqual(maxV1fee)
        expect(wrapper.vm.feeChoices.AVERAGE).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.AVERAGE).toEqual(maxV1fee)
        expect(wrapper.vm.feeChoices.MINIMUM).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.MINIMUM).toEqual(maxV1fee)
      })
    })

    describe('when any fee of the network is less than the V1 max fee', () => {
      beforeEach(() => {
        mockNetwork.feeStatistics = [{
          type: 0,
          fees: {
            avgFee: 0.0048 * 1e8,
            maxFee: 0.03 * 1e8,
            minFee: 0.0006 * 1e8
          }
        }]
      })

      it('should use it as the fee', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.feeChoices.MAXIMUM).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.MAXIMUM).toBeWithin(0.03, 0.03000001)
        expect(wrapper.vm.feeChoices.AVERAGE).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.AVERAGE).toBeWithin(0.0048, 0.00480001)
        expect(wrapper.vm.feeChoices.MINIMUM).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.MINIMUM).toBeWithin(0.0006, 0.00060001)
      })
    })

    describe('when the network returns no statistics', () => {
      beforeEach(() => {
        mockNetwork.feeStatistics = []
      })

      it('should use V1 max fee for maximum', () => {
        const wrapper = mountComponent()

        const maxV1fee = (wrapper.vm.maxV1fee * 1e-8).toString()

        expect(wrapper.vm.feeChoices.MAXIMUM).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.MAXIMUM.toString()).toBe(maxV1fee)
      })

      it('should use the absolute minimum fee (0.00000001) for minimum', () => {
        const wrapper = mountComponent()

        expect(wrapper.vm.feeChoices.MINIMUM).toBeInstanceOf(BigNumber)
        expect(wrapper.vm.feeChoices.MINIMUM.toString()).toBe('0.00000001')
      })
    })
  })

  describe('insufficientFundsError', () => {
    let wrapper

    describe('when the message is enabled', () => {
      beforeEach(() => {
        wrapper = mountComponent({ propsData: { showInsufficientFunds: true } })
      })

      describe('when the balance is smaller than the fee', () => {
        it('should return the message about funds', () => {
          wrapper.vm.wallet_fromRoute.balance = '50000'
          wrapper.vm.fee = 20e8
          expect(wrapper.vm.insufficientFundsError).toEqual('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE')

          wrapper.vm.wallet_fromRoute.balance = '50000'
          wrapper.vm.fee = '20e8'
          expect(wrapper.vm.insufficientFundsError).toEqual('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE')
        })
      })

      describe('when the balance is bigger than the fee', () => {
        it('should return an empty message', () => {
          // NOTE: Balance is in arktoshi, while fee is in ARK
          wrapper.vm.wallet_fromRoute.balance = '20e8'
          wrapper.vm.fee = 1
          expect(wrapper.vm.insufficientFundsError).toBeNull()

          wrapper.vm.wallet_fromRoute.balance = '20e8'
          wrapper.vm.fee = '1'
          expect(wrapper.vm.insufficientFundsError).toBeNull()
        })
      })
    })
  })

  describe('erasing the input', () => {
    describe('events', () => {
      it('should not change on raw', () => {
        const wrapper = mountComponent()
        const input = wrapper.find("input[name='fee']")

        // Cannot use setValue, since it triggers the input event and vue-test-utils don't provide the emitter.
        input.element.value = '0.0000'
        input.trigger('raw')
        expect(input.element.value).toBe('0.0000')
      })

      it('should change on input', () => {
        const wrapper = mountComponent()
        const input = wrapper.find("input[name='fee']")

        // Manually triggers the input event for the input.
        input.element.value = '0.0000'
        input.trigger('input')
        expect(input.element.value).toBe('0')
      })
    })
  })
})
