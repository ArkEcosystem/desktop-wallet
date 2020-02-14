import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../__utils__/i18n'
import { TransactionFormIpfs } from '@/components/Transaction/TransactionForm'
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
const createWrapper = (component, wallet) => {
  component = component || TransactionFormIpfs
  wallet = wallet || {
    address: 'address-1'
  }

  if (!Object.keys(wallet).includes('passphrase')) {
    wallet.passphrase = null
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    mocks: {
      $client: {
        buildIpfs: jest.fn((transactionData) => transactionData)
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

describe('TransactionFormIpfs', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have ipfs transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(5)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormIpfs')).toBe(true)
    })

    it('should have fee field', () => {
      expect(wrapper.contains('.TransactionFormIpfs__fee')).toBe(true)
    })

    it('should have hash field', () => {
      expect(wrapper.contains('.TransactionFormIpfs__fee')).toBe(true)
    })

    describe('ledger notice', () => {
      it('should show if wallet is a ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormIpfs__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormIpfs__ledger-notice')).toBe(false)
      })
    })

    describe('password field', () => {
      it('should show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormIpfs__password')).toBe(true)
      })

      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormIpfs__password')).toBe(false)
      })
    })

    describe('passphrase field', () => {
      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormIpfs__passphrase')).toBe(true)
      })

      it('should not show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormIpfs__passphrase')).toBe(false)
      })
    })

    describe('next button', () => {
      it('should be enabled if form is valid', async () => {
        wrapper.vm.$v.form.hash.$model = 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6'
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormIpfs__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormIpfs__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('computed', () => {
    describe('hashError', () => {
      it('should return error if no valid hash', async () => {
        wrapper.vm.$v.form.hash.$model = 'INVALID HASH'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.hashError).toBe('WALLET_IPFS.HASH_ERROR')
      })

      it('should return error if empty hash', async () => {
        wrapper.vm.$v.form.hash.$model = ''

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.hashError).toBe('WALLET_IPFS.HASH_ERROR')
      })

      it('should return null if valid hash', async () => {
        wrapper.vm.$v.form.hash.$model = 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.hashError).toBe(null)
      })
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase', () => {
        wrapper.vm.$v.form.hash.$model = 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6'
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          hash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
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

        wrapper.vm.$v.form.hash.$model = 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6'
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          secondPassphrase: 'second passphrase',
          hash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build ipfs', async () => {
        const transactionData = {
          type: 5,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildIpfs).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build ipfs with default arguments', async () => {
        const transactionData = {
          type: 7,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildIpfs).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.IPFS')
      })
    })
  })
})
