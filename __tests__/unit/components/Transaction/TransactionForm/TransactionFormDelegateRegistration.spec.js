import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../__utils__/i18n'
import { TransactionFormDelegateRegistration } from '@/components/Transaction/TransactionForm'
import CurrencyMixin from '@/mixins/currency'
import BigNumber from '@/plugins/bignumber'
import store from '@/store'

jest.mock('@/store', () => {
  return {
    getters: {
      'delegate/byUsername': jest.fn(() => false)
    }
  }
})

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
const createWrapper = (component, wallet) => {
  component = component || TransactionFormDelegateRegistration
  wallet = wallet || {
    address: 'address-1',
    passphrase: null
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    mocks: {
      $client: {
        buildDelegateRegistration: jest.fn((transactionData) => transactionData)
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
      currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_fromRoute: wallet
    },
    stubs: {
      Portal: true
    }
  })
}

describe('TransactionFormDelegateRegistration', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have delegate registration transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(2)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormDelegateRegistration')).toBe(true)
    })

    it('should only show message if already registered', () => {
      createWrapper(null, {
        isDelegate: true
      })

      expect(wrapper.contains('.TransactionFormDelegateRegistration__username')).toBe(false)
      expect(wrapper.contains('.TransactionFormDelegateRegistration__fee')).toBe(false)
      expect(wrapper.contains('.TransactionFormDelegateRegistration__ledger-notice')).toBe(false)
      expect(wrapper.contains('.TransactionFormDelegateRegistration__password')).toBe(false)
      expect(wrapper.contains('.TransactionFormDelegateRegistration__passphrase')).toBe(false)
      expect(wrapper.contains('.TransactionFormDelegateRegistration__next')).toBe(false)
    })

    it('should have username field', () => {
      expect(wrapper.contains('.TransactionFormDelegateRegistration__username')).toBe(true)
    })

    it('should have fee field', () => {
      expect(wrapper.contains('.TransactionFormDelegateRegistration__fee')).toBe(true)
    })

    describe('ledger notice', () => {
      it('should show if wallet is a ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormDelegateRegistration__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormDelegateRegistration__ledger-notice')).toBe(false)
      })
    })

    describe('password field', () => {
      it('should show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormDelegateRegistration__password')).toBe(true)
      })

      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormDelegateRegistration__password')).toBe(false)
      })
    })

    describe('passphrase field', () => {
      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormDelegateRegistration__passphrase')).toBe(true)
      })

      it('should not show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormDelegateRegistration__passphrase')).toBe(false)
      })
    })

    describe('next button', () => {
      it('should be enabled if form is valid', async () => {
        wrapper.vm.$v.form.passphrase.$model = 'this is a passphrase'
        wrapper.vm.$v.form.username.$model = 'delegate_1'
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormDelegateRegistration__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormDelegateRegistration__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('computed', () => {
    describe('usernameError', () => {
      it('should return null if valid username', async () => {
        wrapper.vm.$v.form.username.$model = 'delegate_1'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.usernameError).toBe(null)
      })

      it('should return error if empty username', async () => {
        wrapper.vm.$v.form.username.$model = ''

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.usernameError).toBe('WALLET_DELEGATES.USERNAME_EMPTY_ERROR')
      })

      it('should return error if username is too long', async () => {
        wrapper.vm.$v.form.username.$model = ''.padStart(25, '_')

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.usernameError).toBe('WALLET_DELEGATES.USERNAME_MAX_LENGTH_ERROR')
      })

      it('should return error if username exists', async () => {
        const delegateByUsernameSpy = jest.spyOn(store.getters, 'delegate/byUsername').mockReturnValue(true)
        wrapper.vm.$v.form.username.$model = 'delegate_2'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.usernameError).toBe('WALLET_DELEGATES.USERNAME_EXISTS')
        delegateByUsernameSpy.mockRestore()
      })

      it('should return error if no valid username', async () => {
        wrapper.vm.$v.form.username.$model = 'INVALID USERNAME'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.usernameError).toBe('WALLET_DELEGATES.USERNAME_ERROR')
      })
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase', () => {
        wrapper.vm.$v.form.username.$model = 'delegate_1'
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          username: 'delegate_1',
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

        wrapper.vm.$v.form.username.$model = 'delegate_1'
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          secondPassphrase: 'second passphrase',
          username: 'delegate_1',
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build bridgechain registration', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildDelegateRegistration).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build bridgechain registration with default arguments', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildDelegateRegistration).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.DELEGATE_REGISTRATION')
      })
    })
  })
})
