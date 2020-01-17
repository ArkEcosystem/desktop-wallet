import { createLocalVue, mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import installI18n from '../../../../__utils__/i18n'
import TransactionFormBusinessUpdate from '@/components/Transaction/TransactionForm/TransactionFormBusiness/TransactionFormBusinessUpdate'
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
  component = component || TransactionFormBusinessUpdate
  /* eslint-disable-next-line camelcase */
  wallet_fromRoute = wallet_fromRoute || {
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
        buildBusinessUpdate: jest.fn((transactionData) => transactionData)
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

describe('TransactionFormBusinessUpdate', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have magistrate transaction group', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have business update transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(2)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormBusiness')).toBe(true)
    })

    it('should have name field', () => {
      expect(wrapper.contains('.TransactionFormBusiness__name')).toBe(true)
    })

    it('should have website field', () => {
      expect(wrapper.contains('.TransactionFormBusiness__website')).toBe(true)
    })

    it('should have vat field', () => {
      expect(wrapper.contains('.TransactionFormBusiness__vat')).toBe(true)
    })

    it('should have repository field', () => {
      expect(wrapper.contains('.TransactionFormBusiness__repository')).toBe(true)
    })

    describe('ledger notice', () => {
      it('should show if wallet is a ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormBusiness__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormBusiness__ledger-notice')).toBe(false)
      })
    })

    describe('password field', () => {
      it('should show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormBusiness__password')).toBe(true)
      })

      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormBusiness__password')).toBe(false)
      })
    })

    describe('passphrase field', () => {
      it('should show if wallet does not have a password', () => {
        expect(wrapper.contains('.TransactionFormBusiness__passphrase')).toBe(true)
      })

      it('should not show if wallet does have a password', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        expect(wrapper.contains('.TransactionFormBusiness__passphrase')).toBe(false)
      })
    })

    describe('next button', () => {
      it('should be enabled if form is valid', async () => {
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'business'
        wrapper.vm.$v.form.asset.website.$model = 'https://ark.io'
        wrapper.vm.$v.form.asset.vat.$model = 'GB12345678'
        wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBusiness__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBusiness__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('mounted hook', () => {
    it('should load business into form', () => {
      expect(wrapper.vm.form.asset).toEqual({
        name: 'business',
        website: 'https://ark.io',
        vat: 'GB12345678',
        repository: 'https://github.com/arkecosystem/desktop-wallet.git'
      })
    })
  })

  describe('methods', () => {
    describe('buildTransaction', () => {
      it('should build business update', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildBusinessUpdate).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build business update with default arguments', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildBusinessUpdate).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BUSINESS_UPDATE')
      })
    })
  })
})
