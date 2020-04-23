import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import cloneDeep from 'lodash/cloneDeep'
import installI18n from '../../../__utils__/i18n'
import { VENDOR_FIELD } from '@config'
import { TransactionFormTransfer } from '@/components/Transaction/TransactionForm'
import CurrencyMixin from '@/mixins/currency'
import BigNumber from '@/plugins/bignumber'
// import WalletService from '@/services/wallet'

const localVue = createLocalVue()
localVue.use(Vuelidate)
const i18n = installI18n(localVue)

const globalNetwork = Object.freeze({
  id: 'network-1',
  fractionDigits: 8,
  token: 'ARK',
  version: 23,
  wif: 170,
  market: {
    enabled: false
  },
  nethash: 'nethash-1'
})

let wrapper
const createWrapper = (component, wallet, network, props = {}) => {
  component = component || TransactionFormTransfer

  if (wallet === undefined) {
    wallet = {
      id: 'test-wallet'
    }
  }

  if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'passphrase')) {
    wallet.passphrase = null
  }

  if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'address')) {
    wallet.address = 'address-1'
  }

  if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'balance')) {
    wallet.balance = (1000 * 1e8).toString()
  }

  const mountNetwork = network || cloneDeep(globalNetwork)

  wrapper = mount(TransactionFormTransfer, {
    i18n,
    localVue,
    sync: false,
    propsData: props,
    mocks: {
      $client: {
        buildTransfer: jest.fn((transactionData) => transactionData)
      },
      $error: jest.fn(),
      $success: jest.fn(),
      $store: {
        getters: {
          'profile/byId': jest.fn(() => ({
            id: 'profile-1',
            name: 'profile-1',
            networkId: 'network-1'
          })),
          'session/currency': 'EUR',
          get 'ledger/isConnected' () {
            return true
          },
          get 'ledger/wallets' () {
            return [{
              address: 'ledger-address-1'
            }]
          },
          'wallet/byProfileId': jest.fn(() => [wallet]),
          'wallet/contactsByProfileId': jest.fn(() => []),
          'transaction/staticFee': jest.fn(() => null),
          get 'session/profileId' () {
            return 'profile-1'
          },
          'session/lastFeeByType': jest.fn(() => (1 * 1e8).toString()),
          'network/byToken': jest.fn(() => mountNetwork),
          'network/byId': jest.fn(() => mountNetwork),
          'profile/byCompatibleAddress': jest.fn(() => []),
          get 'profile/all' () {
            return [{
              id: 'profile-1',
              name: 'profile-1',
              networkId: 'network-1'
            }, {
              id: 'profile-2',
              name: 'profile-2',
              networkId: 'network-1'
            }]
          }
        }
      },
      $synchronizer: {
        appendFocus: jest.fn()
      },
      currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
      currency_format: jest.fn(CurrencyMixin.methods.currency_format),
      currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
      currency_simpleFormatCrypto: jest.fn(CurrencyMixin.methods.currency_simpleFormatCrypto),
      currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
      formatter_networkCurrency: jest.fn(),
      session_network: mountNetwork,
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_truncate: jest.fn(address => address),
      wallet_name: jest.fn(address => address),
      wallet_fromRoute: wallet
    },
    stubs: {
      Identicon: true,
      Portal: true
    }
  })
}

describe('TransactionFormTransfer', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should not have magistrate transaction group', () => {
    expect(wrapper.vm.$options.transactionGroup).not.toBe(2)
  })

  it('should have transfer transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(0)
  })

  describe('props', () => {
    it('should allow schema', () => {
      wrapper.setProps({
        schema: {
          test: true
        }
      })

      expect(wrapper.vm.schema).toEqual({ test: true })
    })

    it('should default schema', () => {
      expect(wrapper.vm.schema).toEqual(undefined)
    })
  })

  describe('data', () => {
    it('should has properties', () => {
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'step')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'recipientId')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'amount')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'isSendAllActive')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'previousAmount')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'showConfirmSendAll')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'wallet')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'form')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'recipients')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'fee')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'passphrase')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'walletPassword')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'vendorField')).toBe(true)
    })
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormTransfer')).toBe(true)
    })

    it('should have recipient field', () => {
      expect(wrapper.contains('.TransactionFormTransfer__recipient')).toBe(true)
    })

    it('should have amount field', () => {
      expect(wrapper.contains('.TransactionFormTransfer__amount')).toBe(true)
    })

    it('should have add button', () => {
      expect(wrapper.contains('.TransactionFormTransfer__add')).toBe(true)
    })

    describe('step 2', () => {
      beforeEach(() => {
        wrapper.vm.step = 2
      })

      it('should have vendorfield', () => {
        expect(wrapper.contains('.TransactionFormTransfer__vendorfield')).toBe(true)
      })

      it('should have fee field', () => {
        expect(wrapper.contains('.TransactionFormTransfer__fee')).toBe(true)
      })

      describe('ledger notice', () => {
        it('should show if wallet is a ledger', async () => {
          createWrapper(null, {
            isLedger: true
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormTransfer__ledger-notice')).toBe(true)
        })

        it('should show if wallet is not a ledger', async () => {
          createWrapper(null, {
            isLedger: false
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormTransfer__ledger-notice')).toBe(false)
        })
      })

      describe('password field', () => {
        it('should show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormTransfer__password')).toBe(true)
        })

        it('should not show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormTransfer__password')).toBe(false)
        })
      })

      describe('passphrase field', () => {
        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormTransfer__passphrase')).toBe(true)
        })

        it('should not show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormTransfer__passphrase')).toBe(false)
        })
      })
    })

    describe('prev button', () => {
      it('should be enabled if on second form', async () => {
        wrapper.vm.step = 2

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormTransfer__prev').attributes('disabled')).toBeFalsy()
      })
    })

    describe('next button', () => {
      it('should be enabled if recipients form is valid', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }, {
          address: 'address-2',
          amount: 10
        }]
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.vendorField.$model = 'vendorfield test'
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormTransfer__next').attributes('disabled')).toBeFalsy()
      })

      it('should be enabled if both forms are valid', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }, {
          address: 'address-2',
          amount: 10
        }]
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.vendorField.$model = 'vendorfield test'
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormTransfer__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormTransfer__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('computed', () => {
    describe('alternativeCurrency', () => {
      it('should return correct data', () => {
        expect(wrapper.vm.alternativeCurrency).toEqual('EUR')
      })

      it('should update data', () => {
        wrapper.vm.$store.getters['session/currency'] = 'GBP'

        expect(wrapper.vm.alternativeCurrency).toEqual('GBP')
      })
    })

    describe('amountTooLowError', () => {
      it('should return formatted value', () => {
        const $tSpy = jest.fn(translation => translation)
        const simpleFormatCryptoSpy = jest.fn(CurrencyMixin.methods.currency_simpleFormatCrypto)
        const response = TransactionFormTransfer.computed.amountTooLowError.call({
          walletNetwork: globalNetwork,
          $t: $tSpy,
          currency_simpleFormatCrypto: simpleFormatCryptoSpy,
          session_network: globalNetwork
        })

        expect($tSpy).toHaveBeenCalledWith('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', {
          amount: '0.00000001 ARK'
        })
        expect(response).toBe('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM')
        expect(simpleFormatCryptoSpy).toHaveBeenCalledWith('0.00000001')
      })

      it('should return formatted value with different fraction digits', () => {
        const $tSpy = jest.fn(translation => translation)
        const simpleFormatCryptoSpy = jest.fn(CurrencyMixin.methods.currency_simpleFormatCrypto)
        const response = TransactionFormTransfer.computed.amountTooLowError.call({
          walletNetwork: {
            ...globalNetwork,
            fractionDigits: 2
          },
          $t: $tSpy,
          currency_simpleFormatCrypto: simpleFormatCryptoSpy,
          session_network: globalNetwork
        })

        expect($tSpy).toHaveBeenCalledWith('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', {
          amount: '0.01 ARK'
        })
        expect(response).toBe('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM')
        expect(simpleFormatCryptoSpy).toHaveBeenCalledWith('0.01')
      })
    })

    describe('notEnoughBalanceError', () => {
      it('should return a formatted value', () => {
        const $tSpy = jest.fn(translation => translation)
        const formatterNetworkCurrencySpy = jest.fn(value => value)
        const response = TransactionFormTransfer.computed.notEnoughBalanceError.call({
          currentWallet: {
            balance: (10 * 1e8).toString()
          },
          $t: $tSpy,
          formatter_networkCurrency: formatterNetworkCurrencySpy,
          session_network: globalNetwork
        })

        expect(response).toBe('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE')
        expect($tSpy).toHaveBeenCalledWith('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE', {
          balance: '1000000000'
        })
        expect(formatterNetworkCurrencySpy).toHaveBeenCalledWith('1000000000')
      })
    })

    describe('minimumAmount', () => {
      it('should return the correct value', () => {
        expect(wrapper.vm.minimumAmount + '').toBe('0.00000001')
      })
    })

    describe('maximumAvailableAmount', () => {
      it('should return value', () => {
        wrapper.vm.$v.form.fee.$model = 0.1
        expect(wrapper.vm.maximumAvailableAmount).toEqual((new BigNumber(1000)).minus(0.1))
      })

      it('should return value including all recipients', async () => {
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('test')
        wrapper.vm.$v.amount.$model = 10

        await wrapper.vm.$nextTick()
        wrapper.vm.addRecipient()
        await wrapper.vm.$nextTick()

        wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('test')
        wrapper.vm.$v.amount.$model = 20

        await wrapper.vm.$nextTick()
        wrapper.vm.addRecipient()
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.maximumAvailableAmount).toEqual((new BigNumber(1000)).minus(0.1).minus(30))
      })

      it('should return value based on different fee', () => {
        wrapper.vm.form.fee = 10

        expect(wrapper.vm.maximumAvailableAmount).toEqual((new BigNumber(1000)).minus(10))
      })
    })

    describe('vendorFieldLabel', () => {
      it('should return value', () => {
        expect(wrapper.vm.vendorFieldLabel).toBe('TRANSACTION.VENDOR_FIELD - VALIDATION.MAX_LENGTH')
      })
    })

    describe('vendorFieldHelperText', () => {
      describe('default max length', () => {
        let $tSpy
        beforeEach(() => {
          $tSpy = jest.spyOn(wrapper.vm, '$t')
        })

        afterEach(() => {
          $tSpy.mockRestore()
        })

        it('should return null if vendorfield is empty', () => {
          wrapper.vm.form.vendorField = ''

          expect(wrapper.vm.vendorFieldHelperText).toBe(null)
          expect($tSpy).not.toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [VENDOR_FIELD.defaultMaxLength])
        })

        it('should return length warning if equal to max', () => {
          wrapper.vm.form.vendorField = ''.padStart(VENDOR_FIELD.defaultMaxLength, '-')

          expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REACHED')
          expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [VENDOR_FIELD.defaultMaxLength])
        })

        it('should return length warning if less than max', () => {
          wrapper.vm.form.vendorField = ''.padStart(VENDOR_FIELD.defaultMaxLength - 10, '-')

          expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING')
          expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING', [
            10,
            VENDOR_FIELD.defaultMaxLength
          ])
        })
      })

      describe('network max length', () => {
        let $tSpy

        beforeEach(() => {
          const network = {
            ...cloneDeep(globalNetwork),
            vendorField: {
              maxLength: 20
            }
          }
          createWrapper(null, undefined, network)
          $tSpy = jest.spyOn(wrapper.vm, '$t')
        })

        afterEach(() => {
          $tSpy.mockRestore()
        })

        it('should return null if vendorfield is empty', () => {
          wrapper.vm.form.vendorField = ''

          expect(wrapper.vm.vendorFieldHelperText).toBe(null)
          expect($tSpy).not.toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [20])
        })

        it('should return length warning if equal to max', () => {
          wrapper.vm.form.vendorField = ''.padStart(20, '-')

          expect(wrapper.vm.walletNetwork.vendorField.maxLength).toBe(20)
          expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REACHED')
          expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [20])
        })

        it('should return length warning if less than max', () => {
          wrapper.vm.form.vendorField = ''.padStart(20 - 5, '-')

          expect(wrapper.vm.vendorFieldHelperText).toBe('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING')
          expect($tSpy).toHaveBeenCalledWith('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING', [
            5,
            20
          ])
        })
      })
    })

    describe('vendorFieldMaxLength', () => {
      it('should return network max length', () => {
        createWrapper(null, undefined, {
          ...cloneDeep(globalNetwork),
          vendorField: {
            maxLength: 20
          }
        })

        expect(wrapper.vm.vendorFieldMaxLength).toBe(20)
      })

      it('should return default max length if network does not have vendorField max', () => {
        expect(wrapper.vm.vendorFieldMaxLength).toBe(VENDOR_FIELD.defaultMaxLength)
      })
    })

    describe('recipientWarning', () => {
      it('should return null if recipientId is not dirty', () => {
        expect(wrapper.vm.recipientWarning).toBe(null)
      })

      it('should return message for duplicate recipients', () => {
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }]
        wrapper.vm.$v.recipientId.$model = 'address-2'

        expect(wrapper.vm.recipientWarning).toBe('TRANSACTION.MULTI_PAYMENT.WARNING_DUPLICATE')
      })
    })

    describe('maximumRecipients', () => {
      it('should return default if no constants', () => {
        expect(wrapper.vm.maximumRecipients).toBe(500)
      })

      it('should return default if no network value', () => {
        const network = {
          ...cloneDeep(globalNetwork),
          constants: {}
        }

        createWrapper(null, undefined, network)

        expect(wrapper.vm.maximumRecipients).toBe(500)
      })

      it('should return network constant', () => {
        const network = {
          ...cloneDeep(globalNetwork),
          constants: {
            multiPaymentLimit: 20
          }
        }

        createWrapper(null, undefined, network)

        expect(wrapper.vm.maximumRecipients).toBe(20)
      })
    })
  })
})
