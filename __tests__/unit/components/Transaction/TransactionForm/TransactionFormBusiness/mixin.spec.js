import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../../__utils__/i18n'
import TransactionFormBusinessRegistration from '@/components/Transaction/TransactionForm/TransactionFormBusiness/TransactionFormBusinessRegistration'
import TransactionFormBusinessUpdate from '@/components/Transaction/TransactionForm/TransactionFormBusiness/TransactionFormBusinessUpdate'
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
/* eslint-disable-next-line camelcase */
const createWrapper = (component, wallet_fromRoute) => {
  /* eslint-disable-next-line camelcase */
  wallet_fromRoute = wallet_fromRoute || {
    address: 'address-1',
    passphrase: null
  }

  if (component.name === 'TransactionFormBusinessUpdate' && !wallet_fromRoute.business) {
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
        buildBusinessRegistration: jest.fn((transactionData) => transactionData),
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
      currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_fromRoute
    }
  })
}

describe.each([
  ['TransactionFormBusinessRegistration', TransactionFormBusinessRegistration],
  ['TransactionFormBusinessUpdate', TransactionFormBusinessUpdate]
])('%s', (componentName, component) => {
  beforeEach(() => {
    createWrapper(component)
  })

  it('should have magistrate transaction group', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have correct transaction type', () => {
    if (componentName === 'TransactionFormBusinessRegistration') {
      expect(wrapper.vm.$options.transactionType).toBe(0)
    } else {
      expect(wrapper.vm.$options.transactionType).toBe(2)
    }
  })

  describe('data', () => {
    it('should create form object', () => {
      expect(Object.keys(wrapper.vm.form)).toEqual([
        'fee',
        'passphrase',
        'walletPassword',
        'asset'
      ])
      expect(Object.keys(wrapper.vm.form.asset)).toEqual([
        'name',
        'website',
        'vat',
        'repository'
      ])
    })
  })

  if (componentName === 'TransactionFormBusinessUpdate') {
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
  }

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
        createWrapper(component, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormBusiness__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(component, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormBusiness__ledger-notice')).toBe(false)
      })
    })

    describe('password field', () => {
      it('should show if wallet does have a password', () => {
        createWrapper(component, {
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
        createWrapper(component, {
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

  describe('computed', () => {
    describe('nameLabel', () => {
      it('should be formatted', () => {
        expect(wrapper.vm.nameLabel).toBe('WALLET_BUSINESS.NAME - VALIDATION.MAX_LENGTH')
      })
    })

    describe('nameError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.name.$model = 'test'

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
        expect(wrapper.vm.nameError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.name.$model = ''
        wrapper.vm.$v.form.asset.name.$reset()

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(false)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
        expect(wrapper.vm.nameError).toBe(null)
      })

      it('should return required if empty', () => {
        wrapper.vm.$v.form.asset.name.$model = ''

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
        expect(wrapper.vm.nameError).toBe('VALIDATION.REQUIRED')
      })

      it('should not return error if shorter than max (40)', () => {
        wrapper.vm.$v.form.asset.name.$model = ''.padStart(30, '-')

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
        expect(wrapper.vm.nameError).not.toBe('VALIDATION.TOO_LONG')
      })

      it('should not return error if equal to max (40)', () => {
        wrapper.vm.$v.form.asset.name.$model = ''.padStart(40, '-')

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
        expect(wrapper.vm.nameError).not.toBe('VALIDATION.TOO_LONG')
      })

      it('should return error if longer than max (40)', () => {
        wrapper.vm.$v.form.asset.name.$model = ''.padStart(50, '-')

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
        expect(wrapper.vm.nameError).toBe('VALIDATION.TOO_LONG')
      })

      it('should not return error if valid', () => {
        wrapper.vm.$v.form.asset.name.$model = 'test'

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
        expect(wrapper.vm.nameError).not.toBe('VALIDATION.NAME_ERROR')
      })

      it('should return error if invalid', () => {
        wrapper.vm.$v.form.asset.name.$model = '$ARK'

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
        expect(wrapper.vm.nameError).toBe('VALIDATION.NAME_ERROR')
      })
    })

    describe('websiteError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.website.$model = 'http://ark.io'

        expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(false)
        expect(wrapper.vm.websiteError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.website.$model = ''
        wrapper.vm.$v.form.asset.website.$reset()

        expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(false)
        expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(true)
        expect(wrapper.vm.websiteError).toBe(null)
      })

      it('should return required if empty', () => {
        wrapper.vm.$v.form.asset.website.$model = ''

        expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(true)
        expect(wrapper.vm.websiteError).toBe('VALIDATION.REQUIRED')
      })

      it('should not return error if valid', () => {
        wrapper.vm.$v.form.asset.website.$model = 'https://ark.io:4003'

        expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(false)
        expect(wrapper.vm.websiteError).not.toBe('VALIDATION.INVALID_URL')
      })

      it('should return error if invalid', () => {
        wrapper.vm.$v.form.asset.website.$model = 'http://ark'

        expect(wrapper.vm.$v.form.asset.website.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.website.$invalid).toBe(true)
        expect(wrapper.vm.websiteError).toBe('VALIDATION.INVALID_URL')
      })
    })

    describe('vatLabel', () => {
      it('should be formatted', () => {
        expect(wrapper.vm.vatLabel).toBe('WALLET_BUSINESS.VAT - VALIDATION.MIN_LENGTH VALIDATION.MAX_LENGTH')
      })
    })

    describe('vatError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.vat.$model = 'GB12345678'

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''
        wrapper.vm.$v.form.asset.vat.$reset()

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(false)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).toBe(null)
      })

      it('should return null if empty as not required', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).toBe(null)
      })

      it('should not return error if shorter than max (15)', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''.padStart(10, '-')

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_LONG')
      })

      it('should not return error if equal to max (15)', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''.padStart(15, '-')

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_LONG')
      })

      it('should not return error if longer than min (8)', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''.padStart(10, '-')

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_SHORT')
      })

      it('should not return error if equal to min (8)', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''.padStart(15, '-')

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).not.toBe('VALIDATION.TOO_SHORT')
      })

      it('should return error if longer than max (40)', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''.padStart(50, '-')

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(true)
        expect(wrapper.vm.vatError).toBe('VALIDATION.TOO_LONG')
      })

      it('should return error if shorter than min (8)', () => {
        wrapper.vm.$v.form.asset.vat.$model = ''.padStart(5, '-')

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(true)
        expect(wrapper.vm.vatError).toBe('VALIDATION.TOO_SHORT')
      })

      it('should not return error if valid', () => {
        wrapper.vm.$v.form.asset.vat.$model = 'GB12345678'

        expect(wrapper.vm.$v.form.asset.vat.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.vat.$invalid).toBe(false)
        expect(wrapper.vm.vatError).not.toBe('VALIDATION.NAME_ERROR')
      })
    })

    describe('repositoryLabel', () => {
      it('should be formatted', () => {
        expect(wrapper.vm.repositoryLabel).toBe('WALLET_BUSINESS.REPOSITORY - VALIDATION.MIN_LENGTH')
      })
    })

    describe('repositoryError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

        expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false)
        expect(wrapper.vm.repositoryError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.repository.$model = ''
        wrapper.vm.$v.form.asset.repository.$reset()

        expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(false)
        expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false)
        expect(wrapper.vm.repositoryError).toBe(null)
      })

      it('should not return error if longer than min (12)', () => {
        wrapper.vm.$v.form.asset.repository.$model = 'http://github.com'

        expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false)
        expect(wrapper.vm.repositoryError).not.toBe('VALIDATION.TOO_SHORT')
      })

      it('should not return error if equal to min (12)', () => {
        wrapper.vm.$v.form.asset.repository.$model = 'http://g.com'

        expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false)
        expect(wrapper.vm.repositoryError).not.toBe('VALIDATION.TOO_SHORT')
      })

      it('should return error if shorter than min (12)', () => {
        wrapper.vm.$v.form.asset.repository.$model = 'ftp://g.co'

        expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(true)
        expect(wrapper.vm.repositoryError).toBe('VALIDATION.TOO_SHORT')
      })

      it('should not return error if valid', () => {
        wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

        expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(false)
        expect(wrapper.vm.repositoryError).not.toBe('VALIDATION.INVALID_URL')
      })

      it('should return error if invalid', () => {
        wrapper.vm.$v.form.asset.repository.$model = 'https://github/arkecosystem/desktop-wallet.git'

        expect(wrapper.vm.$v.form.asset.repository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.repository.$invalid).toBe(true)
        expect(wrapper.vm.repositoryError).toBe('VALIDATION.INVALID_URL')
      })
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase', () => {
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'business'
        wrapper.vm.$v.form.asset.website.$model = 'https://ark.io'
        wrapper.vm.$v.form.asset.vat.$model = 'GB12345678'
        wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          asset: {
            name: 'business',
            website: 'https://ark.io',
            vat: 'GB12345678',
            repository: 'https://github.com/arkecosystem/desktop-wallet.git'
          },
          passphrase: 'passphrase',
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })

      it('should return correct data with passphrase and second passphrase', () => {
        createWrapper(component, {
          address: 'address-1',
          passphrase: null,
          secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
        })

        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'business'
        wrapper.vm.$v.form.asset.website.$model = 'https://ark.io'
        wrapper.vm.$v.form.asset.vat.$model = 'GB12345678'
        wrapper.vm.$v.form.asset.repository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          asset: {
            name: 'business',
            website: 'https://ark.io',
            vat: 'GB12345678',
            repository: 'https://github.com/arkecosystem/desktop-wallet.git'
          },
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
      it('should build business update', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        if (componentName === 'TransactionFormBusinessRegistration') {
          expect(wrapper.vm.$client.buildBusinessRegistration).toHaveBeenCalledWith(transactionData, true, true)
        } else {
          expect(wrapper.vm.$client.buildBusinessUpdate).toHaveBeenCalledWith(transactionData, true, true)
        }
        expect(response).toBe(transactionData)
      })

      it('should build business update with default arguments', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        if (componentName === 'TransactionFormBusinessRegistration') {
          expect(wrapper.vm.$client.buildBusinessRegistration).toHaveBeenCalledWith(transactionData, false, false)
        } else {
          expect(wrapper.vm.$client.buildBusinessUpdate).toHaveBeenCalledWith(transactionData, false, false)
        }
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        if (componentName === 'TransactionFormBusinessRegistration') {
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BUSINESS_REGISTRATION')
        } else {
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BUSINESS_UPDATE')
        }
      })
    })
  })
})
