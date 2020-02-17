import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../__utils__/i18n'
import { TransactionFormDelegateResignation } from '@/components/Transaction/TransactionForm'
import CurrencyMixin from '@/mixins/currency'
import BigNumber from '@/plugins/bignumber'

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
const createWrapper = (component, wallet, delegate) => {
  component = component || TransactionFormDelegateResignation
  wallet = wallet || {
    address: 'address-1'
  }

  if (!Object.keys(wallet).includes('passphrase')) {
    wallet.passphrase = null
  }

  if (!Object.keys(wallet).includes('isDelegate')) {
    wallet.isDelegate = true
  }

  if (delegate === undefined) {
    delegate = {
      username: 'delegate-1'
    }
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    mocks: {
      $client: {
        buildDelegateResignation: jest.fn((transactionData) => transactionData)
      },
      $error: jest.fn(),
      $store: {
        getters: {
          'delegate/byAddress': jest.fn(() => delegate),
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
      currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_fromRoute: wallet
    },
    stubs: {
      Portal: true
    }
  })
}

describe('TransactionFormDelegateResignation', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have delegate resignation transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(7)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormDelegateResignation')).toBe(true)
    })

    it('should have fee field', () => {
      expect(wrapper.contains('.TransactionFormDelegateResignation__fee')).toBe(true)
    })

    describe('ledger notice', () => {
      it('should show if wallet is a ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormDelegateResignation__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormDelegateResignation__ledger-notice')).toBe(false)
      })
    })

    describe('password field', () => {
      it('should show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormDelegateResignation__password')).toBe(true)
      })

      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormDelegateResignation__password')).toBe(false)
      })
    })

    describe('passphrase field', () => {
      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormDelegateResignation__passphrase')).toBe(true)
      })

      it('should not show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormDelegateResignation__passphrase')).toBe(false)
      })
    })

    describe('next button', () => {
      it('should be enabled if form is valid', async () => {
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormDelegateResignation__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormDelegateResignation__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('computed', () => {
    describe('username', () => {
      it('should return username', () => {
        expect(wrapper.vm.username).toBe('delegate-1')
      })

      it('should return null if not a delegate', () => {
        createWrapper(null, null, null)
        expect(wrapper.vm.username).toBe(null)
      })
    })

    describe('canResign', () => {
      it('should return true if delegate and has username', () => {
        expect(wrapper.vm.canResign).toBe(true)
      })

      it('should return false if not a delegate', () => {
        createWrapper(null, {
          isDelegate: false
        })

        expect(wrapper.vm.canResign).toBe(false)
      })

      it('should return false if no username', () => {
        createWrapper(null, {
          isDelegate: true
        }, {})

        expect(wrapper.vm.canResign).toBe(false)
      })
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase', () => {
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })

      it('should return correct data with passphrase and second passphrase', () => {
        createWrapper(null, {
          address: 'address-1',
          passphrase: null,
          secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
        })

        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          secondPassphrase: 'second passphrase',
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build delegate resignation', async () => {
        const transactionData = {
          type: 7,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildDelegateResignation).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build delegate resignation with default arguments', async () => {
        const transactionData = {
          type: 7,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildDelegateResignation).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.DELEGATE_RESIGNATION')
      })
    })
  })
})
