import { createLocalVue, mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import installI18n from '../../../../__utils__/i18n'
import TransactionFormBridgechainRegistration from '@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainRegistration'
import CurrencyMixin from '@/mixins/currency'

const localVue = createLocalVue()
localVue.use(Vuelidate)
const i18n = installI18n(localVue)

const network = {
  token: 'ARK',
  version: 23,
  wif: 170,
  market: {
    enabled: false
  }
}

let wrapper
/* eslint-disable-next-line camelcase */
const createWrapper = (component, wallet_fromRoute) => {
  component = component || TransactionFormBridgechainRegistration
  /* eslint-disable-next-line camelcase */
  wallet_fromRoute = wallet_fromRoute || {
    passphrase: null
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    mocks: {
      $client: {
        buildBridgechainRegistration: jest.fn((transactionData) => transactionData)
      },
      $error: jest.fn(),
      $store: {
        getters: {
          'transaction/staticFee': jest.fn(() => null),
          'session/lastFeeByType': jest.fn(() => (1 * 1e8).toString()),
          'session/network': network,
          'network/byToken': jest.fn(() => (network))
        }
      },
      $synchronizer: {
        appendFocus: jest.fn()
      },
      session_network: network,
      currency_format: jest.fn(CurrencyMixin.methods.currency_format),
      currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
      currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_fromRoute
    }
  })
}

describe('TransactionFormBridgechainRegistration', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have magistrate transaction group', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have bridgechain registration transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(3)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormBridgechain')).toBe(true)
    })

    describe('step 1', () => {
      it('should have seed node field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__seed-node')).toBe(true)
      })

      it('should have add button', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__add')).toBe(true)
      })

      it('should have seed nodes list', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__seed-nodes')).toBe(true)
      })
    })

    describe('step 2', () => {
      beforeEach(() => {
        wrapper.vm.step = 2
      })

      it('should have name field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__name')).toBe(true)
      })

      it('should have genesis hash field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__genesis-hash')).toBe(true)
      })

      it('should have bridgechain repository field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__bridgechain-repository')).toBe(true)
      })

      it('should have api port field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__api-port')).toBe(true)
      })

      it('should have fee field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__fee')).toBe(true)
      })

      describe('ledger notice', () => {
        it('should show if wallet is a ledger', async () => {
          createWrapper(null, {
            isLedger: true
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(true)
        })

        it('should show if wallet is not a ledger', async () => {
          createWrapper(null, {
            isLedger: false
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(false)
        })
      })

      describe('password field', () => {
        it('should show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__password')).toBe(true)
        })

        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormBridgechain__password')).toBe(false)
        })
      })

      describe('passphrase field', () => {
        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormBridgechain__passphrase')).toBe(true)
        })

        it('should not show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__passphrase')).toBe(false)
        })
      })
    })

    describe('prev button', () => {
      it('should be enabled if form is on step 2', async () => {
        wrapper.vm.step = 2

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__prev').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is on step 1', async () => {
        wrapper.vm.step = 1

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__prev').attributes('disabled')).toBe('disabled')
      })
    })

    describe('next button', () => {
      it('should be enabled if seed nodes is valid on step 1', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.asset.seedNodes.$model = [
          '1.1.1.1'
        ]

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBeFalsy()
      })

      it('should be enabled if form is valid on step 2', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'bridgechain'
        wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
        wrapper.vm.form.asset.ports = {
          '@arkecosystem/core-api': 4003
        }
        wrapper.vm.$v.form.asset.seedNodes.$model = [
          '1.1.1.1'
        ]
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if seed nodes is invalid on step 1', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.asset.seedNodes.$model = []

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBe('disabled')
      })

      it('should be disabled if form is invalid on step 2', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.asset.seedNodes.$model = []

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('methods', () => {
    describe('buildTransaction', () => {
      it('should build bridgechain registration', async () => {
        const transactionData = {
          type: 3,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildBridgechainRegistration).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build bridgechain registration with default arguments', async () => {
        const transactionData = {
          type: 3,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildBridgechainRegistration).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_REGISTRATION')
      })
    })
  })
})
