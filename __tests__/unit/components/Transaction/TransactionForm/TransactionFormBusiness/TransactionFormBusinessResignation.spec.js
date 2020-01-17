import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../../__utils__/i18n'
import TransactionFormBusinessResignation from '@/components/Transaction/TransactionForm/TransactionFormBusiness/TransactionFormBusinessResignation'
import CurrencyMixin from '@/mixins/currency'
import BigNumber from '@/plugins/bignumber'
import WalletService from '@/services/wallet'

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
  component = component || TransactionFormBusinessResignation
  /* eslint-disable-next-line camelcase */
  wallet_fromRoute = wallet_fromRoute || {
    address: 'address-1',
    passphrase: null
  }

  if (!wallet_fromRoute.business) {
    wallet_fromRoute.business = {
      name: 'business',
      website: 'https://ark.io',
      vat: 'GB12345678',
      repository: 'https://github.com/arkecosystem/desktop-wallet.git'
    }
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    mocks: {
      $client: {
        buildBusinessResignation: jest.fn((transactionData) => transactionData)
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
      wallet_fromRoute
    },
    stubs: {
      Portal: true
    }
  })
}

let spyCanResignBusiness
describe('TransactionFormBusinessResignation', () => {
  beforeEach(() => {
    spyCanResignBusiness = jest.spyOn(WalletService, 'canResignBusiness').mockReturnValue(true)

    createWrapper()
  })

  afterEach(() => {
    spyCanResignBusiness.mockRestore()
  })

  it('should have magistrate transaction group', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have business resignation transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(1)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormBusinessResignation')).toBe(true)
    })

    describe('ledger notice', () => {
      it('should show if wallet is a ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormBusinessResignation__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormBusinessResignation__ledger-notice')).toBe(false)
      })
    })

    describe('password field', () => {
      it('should show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormBusinessResignation__password')).toBe(true)
      })

      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormBusinessResignation__password')).toBe(false)
      })
    })

    describe('passphrase field', () => {
      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormBusinessResignation__passphrase')).toBe(true)
      })

      it('should not show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormBusinessResignation__passphrase')).toBe(false)
      })
    })

    describe('next button', () => {
      it('should be enabled if form is valid', async () => {
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBusinessResignation__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBusinessResignation__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('computed', () => {
    describe('canResignBusiness', () => {
      it('should return true', () => {
        spyCanResignBusiness.mockReturnValue(true)

        createWrapper()

        expect(wrapper.vm.canResignBusiness).toBe(true)
      })

      it('should return false', () => {
        spyCanResignBusiness.mockReturnValue(false)

        createWrapper()

        expect(wrapper.vm.canResignBusiness).toBe(false)
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
      it('should build business resignation', async () => {
        const transactionData = {
          type: 0,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildBusinessResignation).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build business resignation with default arguments', async () => {
        const transactionData = {
          type: 0,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildBusinessResignation).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BUSINESS_RESIGNATION')
      })
    })
  })
})
