import merge from 'lodash/merge'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import TransactionFormTransfer from '@/components/Transaction/TransactionForm/TransactionFormTransfer'
import BigNumber from '@/plugins/bignumber'
import WalletService from '@/services/wallet'

const i18n = useI18nGlobally()

Vue.use(Vuelidate)

describe('TransactionFormTransfer', () => {
  const mountComponent = config => {
    return shallowMount(TransactionFormTransfer, merge({
      i18n,
      mocks: {
        $error: jest.fn(),
        $store: {
          getters: {
            'profile/byId': () => {},
            'session/currency': 'EUR'
          }
        },
        $success: jest.fn(),
        currency_simpleFormatCrypto: amount => amount,
        currency_subToUnit: amount => new BigNumber(amount),
        formatter_networkCurrency: jest.fn(),
        session_network: {
          token: 'NET',
          version: 11
        },
        wallet_formatAddress: address => address,
        wallet_truncate: address => address
      }
    }, config))
  }

  it('should be instantiated', () => {
    const wrapper = mountComponent()
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('loadTransaction', () => {
    describe('when a valid JSON file is opened', () => {
      it('should display an error alert if the transaction has the wrong type', async () => {
        const wrapper = mountComponent({
          mocks: {
            electron_readFile: jest.fn(async () => {
              return '{ "type": "1" }'
            })
          }
        })

        await wrapper.vm.loadTransaction()

        expect(wrapper.vm.$error).toHaveBeenCalled()
      })

      it('should display an error alert if the recipient is on a different network', async () => {
        WalletService.validateAddress = jest.fn(() => false)

        const wrapper = mountComponent({
          mocks: {
            electron_readFile: jest.fn(async () => {
              return '{ "recipientId": "AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm" }'
            })
          }
        })

        await wrapper.vm.loadTransaction()

        expect(wrapper.vm.$error).toHaveBeenCalled()
      })

      it('should display a success alert', async () => {
        const wrapper = mountComponent({
          mocks: {
            electron_readFile: jest.fn(async () => {
              return '{ "type": "0" }'
            })
          }
        })

        await wrapper.vm.loadTransaction()

        expect(wrapper.vm.$success).toHaveBeenCalled()
      })
    })

    describe('when an invalid JSON file is opened', () => {
      it('should display an error alert', async () => {
        const wrapper = mountComponent({
          mocks: {
            electron_readFile: jest.fn(async () => {
              return 'invalid json'
            })
          }
        })

        await wrapper.vm.loadTransaction()

        expect(wrapper.vm.$error).toHaveBeenCalled()
      })
    })
  })
})
