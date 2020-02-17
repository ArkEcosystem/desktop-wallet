import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../__utils__/i18n'
import { TransactionFormMultiSign } from '@/components/Transaction/TransactionForm'
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
const createWrapper = (component, wallet, transaction) => {
  component = component || TransactionFormMultiSign
  wallet = wallet || {
    address: 'address-1',
    publicKey: 'public-key-1'
  }
  transaction = transaction || {
    amount: (1 * 1e8).toString(),
    fee: (0.1 * 1e8).toString(),
    recipientId: 'recipient-address',
    vendorField: 'test vendorField'
  }

  if (!Object.keys(wallet).includes('passphrase')) {
    wallet.passphrase = null
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    propsData: {
      transaction
    },
    mocks: {
      $client: {
        multiSign: jest.fn((transaction) => transaction)
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

describe('TransactionFormMultiSign', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have multisign transaction type - placeholder', () => {
    expect(wrapper.vm.$options.transactionType).toBe(-1)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormMultiSign')).toBe(true)
    })

    describe('ledger notice', () => {
      it('should show if wallet is a ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormMultiSign__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormMultiSign__ledger-notice')).toBe(false)
      })
    })

    describe('password field', () => {
      it('should show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormMultiSign__password')).toBe(true)
      })

      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormMultiSign__password')).toBe(false)
      })
    })

    describe('passphrase field', () => {
      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormMultiSign__passphrase')).toBe(true)
      })

      it('should not show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormMultiSign__passphrase')).toBe(false)
      })
    })

    describe('next button', () => {
      it('should be enabled if form is valid', async () => {
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormMultiSign__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormMultiSign__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase', () => {
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          publicKey: 'public-key-1',
          passphrase: 'passphrase',
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })

      it('should return correct data with passphrase and second passphrase', () => {
        createWrapper(null, {
          publicKey: 'public-key-1',
          passphrase: null,
          secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
        })

        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          publicKey: 'public-key-1',
          passphrase: 'passphrase',
          secondPassphrase: 'second passphrase',
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build signed transaction', async () => {
        const transaction = {
          type: 0,
          amount: 10,
          fee: 0.1
        }
        const transactionData = {
          type: 0,
          typeGroup: 1
        }

        wrapper.setProps({
          transaction
        })

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.multiSign).toHaveBeenCalledWith(transaction, transactionData)
        expect(response).toBe(transaction)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.MULTI_SIGN')
      })
    })
  })
})
