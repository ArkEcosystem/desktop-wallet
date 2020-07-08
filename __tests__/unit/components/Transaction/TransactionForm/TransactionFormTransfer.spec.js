import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import cloneDeep from 'lodash/cloneDeep'
import installI18n from '../../../__utils__/i18n'
import { VENDOR_FIELD } from '@config'
import { TransactionFormTransfer } from '@/components/Transaction/TransactionForm'
import CurrencyMixin from '@/mixins/currency'
import BigNumber from '@/plugins/bignumber'
import WalletService from '@/services/wallet'

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
  nethash: 'nethash-1',
  constants: {
    aip11: true
  }
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
        buildTransfer: jest.fn((transactionData) => transactionData),
        buildMultiPayment: jest.fn((transactionData) => transactionData)
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

    it('should have add button on multiple tab', async () => {
      expect(wrapper.contains('.TransactionFormTransfer__add')).toBe(false)

      wrapper.vm.onSendTypeChange('Multiple')
      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionFormTransfer__add')).toBe(true)
    })

    it('should have send all switch', () => {
      expect(wrapper.contains('.TransactionFormTransfer__send-all')).toBe(true)
    })

    describe('wallet selection', () => {
      it('should show if schema prop is provided with address', async () => {
        wrapper.setProps({
          schema: {
            address: 'address-1'
          }
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.contains('.TransactionFormTransfer__wallet')).toBe(true)
      })

      it('should not show if no schema prop is provided', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormTransfer__wallet')).toBe(false)
      })
    })

    describe('ledger notice', () => {
      it('should show if wallet is a ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        expect(wrapper.contains('.TransactionFormTransfer__ledger-notice')).toBe(true)
      })

      it('should show if wallet is not a ledger', () => {
        createWrapper(null, {
          isLedger: false
        })

        expect(wrapper.contains('.TransactionFormTransfer__ledger-notice')).toBe(false)
      })
    })

    describe('next button', () => {
      it('should be enabled for single if recipients form is valid', async () => {
        wrapper.vm.$v.recipientId.$model = 'address-1'
        wrapper.vm.$v.amount.$model = 10
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.vendorField.$model = 'vendorfield test'
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormTransfer__next').attributes('disabled')).toBeFalsy()
      })

      it('should be enabled for multiple if recipients form is valid', async () => {
        wrapper.vm.onSendTypeChange('Multiple')
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

    describe('isMultiPayment', () => {
      it('should return false if it is a normal transaction', () => {
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }]

        expect(wrapper.vm.isMultiPayment).toBe(false)
      })

      it('should return true if it is multipayment transaction', () => {
        wrapper.vm.onSendTypeChange('Multiple')
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }, {
          address: 'address-3',
          amount: 10
        }]

        expect(wrapper.vm.isMultiPayment).toBe(true)
      })
    })

    describe('hasAip11', () => {
      it('should return true if it is aip11', () => {
        const response = TransactionFormTransfer.computed.walletNetwork.call({
          session_network: globalNetwork,
          currentWallet: null
        })

        expect(response.constants.aip11).toBe(true)
      })

      it('should return false if aip11 is false', () => {
        const response = TransactionFormTransfer.computed.walletNetwork.call({
          session_network: {
            ...globalNetwork,
            constants: {
              ...globalNetwork.constants,
              aip11: false
            }
          },
          currentWallet: null
        })

        expect(response.constants.aip11).toBe(false)
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

      it('should return value including all recipients for multiple', async () => {
        wrapper.vm.onSendTypeChange('Multiple')

        await wrapper.vm.$nextTick()

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

    describe('canSendAll', () => {
      it('should return true if amount is greater than 0', () => {
        expect(wrapper.vm.currentWallet.balance).toBe((1000 * 1e8).toString())
        expect(wrapper.vm.form.fee).toBe('0.1')
        expect(wrapper.vm.canSendAll).toBe(true)
      })

      it('should return false if maximumAvailableAmount is 0', () => {
        createWrapper(null, {
          balance: (0.1 * 1e8).toString()
        })

        expect(wrapper.vm.currentWallet.balance).toBe((0.1 * 1e8).toString())
        expect(wrapper.vm.form.fee).toBe('0.1')
        expect(wrapper.vm.canSendAll).toBe(false)
      })
    })

    describe('senderLabel', () => {
      it('should return formatted address if currentWallet', () => {
        expect(wrapper.vm.senderLabel).toEqual('formatted-address-1')
      })

      it('should return null if no current wallet', async () => {
        createWrapper(null, null)

        expect(wrapper.vm.senderLabel).toEqual(null)
      })
    })

    describe('senderWallet', () => {
      it('should return wallet if set', () => {
        wrapper.vm.wallet = {
          address: 'address-1'
        }

        expect(wrapper.vm.senderWallet).toEqual({
          address: 'address-1'
        })
      })
    })

    describe('walletNetwork', () => {
      it('should return current network if no wallet selected', () => {
        const profileByIdSpy = jest.fn()
        const networkByIdSpy = jest.fn()
        const response = TransactionFormTransfer.computed.walletNetwork.call({
          $store: {
            getters: {
              'network/byId': networkByIdSpy,
              'profile/byId': profileByIdSpy
            }
          },
          session_network: globalNetwork,
          currentWallet: null
        })

        expect(response).toBe(globalNetwork)
        expect(profileByIdSpy).not.toHaveBeenCalled()
        expect(networkByIdSpy).not.toHaveBeenCalled()
      })

      it('should return current network if wallet does not have id', () => {
        const profileByIdSpy = jest.fn()
        const networkByIdSpy = jest.fn()
        const response = TransactionFormTransfer.computed.walletNetwork.call({
          $store: {
            getters: {
              'network/byId': networkByIdSpy,
              'profile/byId': profileByIdSpy
            }
          },
          session_network: globalNetwork,
          currentWallet: {}
        })

        expect(response).toBe(globalNetwork)
        expect(profileByIdSpy).not.toHaveBeenCalled()
        expect(networkByIdSpy).not.toHaveBeenCalled()
      })

      it('should return current network if no profile selected', () => {
        const profileByIdSpy = jest.fn()
        const networkByIdSpy = jest.fn()
        const response = TransactionFormTransfer.computed.walletNetwork.call({
          $store: {
            getters: {
              'network/byId': networkByIdSpy,
              'profile/byId': profileByIdSpy
            }
          },
          session_network: globalNetwork,
          currentWallet: {
            id: 'test',
            profileId: 'profile-id'
          }
        })

        expect(response).toBe(globalNetwork)
        expect(profileByIdSpy).toHaveBeenCalledWith('profile-id')
        expect(networkByIdSpy).not.toHaveBeenCalled()
      })

      it('should return current network if no network for profile selected', () => {
        const profileByIdSpy = jest.fn(() => ({
          id: 'profile-id',
          networkId: 'network-id'
        }))
        const networkByIdSpy = jest.fn()
        const response = TransactionFormTransfer.computed.walletNetwork.call({
          $store: {
            getters: {
              'network/byId': networkByIdSpy,
              'profile/byId': profileByIdSpy
            }
          },
          session_network: globalNetwork,
          currentWallet: {
            id: 'test',
            profileId: 'profile-id'
          }
        })

        expect(response).toBe(globalNetwork)
        expect(profileByIdSpy).toHaveBeenCalledWith('profile-id')
        expect(networkByIdSpy).toHaveBeenCalledWith('network-id')
      })

      it('should return profile network if no network for profile selected', () => {
        const profileNetwork = {
          fractionDigits: 2,
          token: 'DARK',
          version: 30,
          wif: 170,
          market: {
            enabled: false
          }
        }
        const profileByIdSpy = jest.fn(() => ({
          id: 'profile-id',
          networkId: 'network-id'
        }))
        const networkByIdSpy = jest.fn(() => profileNetwork)
        const response = TransactionFormTransfer.computed.walletNetwork.call({
          $store: {
            getters: {
              'network/byId': networkByIdSpy,
              'profile/byId': profileByIdSpy
            }
          },
          session_network: globalNetwork,
          currentWallet: {
            id: 'test',
            profileId: 'profile-id'
          }
        })

        expect(response).toBe(profileNetwork)
        expect(profileByIdSpy).toHaveBeenCalledWith('profile-id')
        expect(networkByIdSpy).toHaveBeenCalledWith('network-id')
      })
    })

    describe('currentWallet', () => {
      it('should get sender wallet', () => {
        wrapper.vm.wallet = {
          id: 'test',
          balance: 0,
          address: 'address-3'
        }

        expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet)
      })

      it('should get wallet from route', () => {
        const newWallet = {
          id: 'test',
          balance: 20,
          address: 'address-2'
        }
        createWrapper(null, newWallet)

        wrapper.vm.wallet = null

        expect(wrapper.vm.senderWallet).toBe(null)
        expect(wrapper.vm.currentWallet).toBe(newWallet)
      })

      it('should set wallet', () => {
        const newWallet = {
          id: 'test',
          balance: 20,
          address: 'address-2'
        }

        wrapper.vm.wallet = null
        wrapper.vm.currentWallet = newWallet

        expect(wrapper.vm.wallet).toBe(newWallet)
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

  describe('watch', () => {
    it('should ensure available amount', async () => {
      const spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount')

      wrapper.vm.wallet = {
        balance: 0,
        address: 'address-4',
        passphrase: null
      }

      await wrapper.vm.$nextTick()

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should check trigger recipient validation', async () => {
      const spy = jest.spyOn(wrapper.vm.$v.recipientId, '$touch', 'get')

      wrapper.vm.wallet = {
        balance: 0,
        address: 'address-4',
        passphrase: null
      }

      await wrapper.vm.$nextTick()

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('mounted hook', () => {
    it('should set wallet object', () => {
      expect(wrapper.vm.currentWallet).toBe(wrapper.vm.currentWallet)
      expect(wrapper.vm.wallet).toBe(wrapper.vm.currentWallet)
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase for normal transaction', async () => {
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.vendorField.$model = 'vendorfield test'
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: (1 * 1e8).toString()
        }]
        wrapper.vm.$v.recipientId.$model = 'address-1'
        wrapper.vm.$v.amount.$model = 50
        // wrapper.vm.$v.recipientId.$model = wrapper.vm.$v.form.recipients.$model[0].address
        // wrapper.vm.$v.amount.$model = wrapper.vm.$v.form.recipients.$model[0].amount

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          recipientId: 'address-1',
          amount: new BigNumber(50 * 1e8),
          fee: new BigNumber(0.1 * 1e8),
          vendorField: 'vendorfield test',
          wif: undefined,
          networkWif: 170,
          networkId: 'network-1',
          multiSignature: undefined
        })
      })

      it('should return correct data with passphrase for multipayment transaction', () => {
        wrapper.vm.onSendTypeChange('Multiple')
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.vendorField.$model = 'vendorfield test'
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: (1 * 1e8).toString()
        }, {
          address: 'address-3',
          amount: (1 * 1e8).toString()
        }]

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          recipients: [{
            address: 'address-2',
            amount: (1 * 1e8).toString()
          }, {
            address: 'address-3',
            amount: (1 * 1e8).toString()
          }],
          fee: new BigNumber(0.1 * 1e8),
          vendorField: 'vendorfield test',
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

        wrapper.vm.onSendTypeChange('Multiple')
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.vendorField.$model = 'vendorfield test'
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase'
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: (1 * 1e8).toString()
        }, {
          address: 'address-3',
          amount: (1 * 1e8).toString()
        }]

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          secondPassphrase: 'second passphrase',
          recipients: [{
            address: 'address-2',
            amount: (1 * 1e8).toString()
          }, {
            address: 'address-3',
            amount: (1 * 1e8).toString()
          }],
          fee: new BigNumber(0.1 * 1e8),
          vendorField: 'vendorfield test',
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build normal transaction', async () => {
        const transactionData = {
          type: 0,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildTransfer).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build multipayment transaction', async () => {
        wrapper.vm.onSendTypeChange('Multiple')
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }, {
          address: 'address-3',
          amount: 10
        }]

        const transactionData = {
          type: 6,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildMultiPayment).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build normal transaction with default arguments', async () => {
        const transactionData = {
          type: 0,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildTransfer).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })

      it('should build multipayment transaction with default arguments', async () => {
        wrapper.vm.onSendTypeChange('Multiple')
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }, {
          address: 'address-3',
          amount: 10
        }]

        const transactionData = {
          type: 6,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildMultiPayment).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('populateSchema', () => {
      it('should do nothing if no schema data', () => {
        const spy = jest.spyOn(wrapper.vm, '$set')

        wrapper.setProps({
          schema: null
        })

        expect(spy).not.toHaveBeenCalled()
      })

      it('should load in schema form data', () => {
        wrapper.setProps({
          schema: {
            address: 'address-5',
            amount: 100,
            vendorField: 'test vendorfield'
          }
        })

        wrapper.vm.populateSchema()

        expect(wrapper.vm.recipientId).toBe('address-5')
        expect(wrapper.vm.amount).toEqual(100)
        expect(wrapper.vm.form.vendorField).toBe('test vendorfield')
      })

      it('should load in schema wallet data', () => {
        const sessionProfileIdSpy = jest.spyOn(wrapper.vm.$store.getters, 'session/profileId', 'get')
        const ledgerConnectedSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/isConnected', 'get')
        const ledgerWalletsSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/wallets', 'get')
        const profileAllSpy = jest.spyOn(wrapper.vm.$store.getters, 'profile/all', 'get')

        wrapper.setProps({
          schema: {
            wallet: 'address-1'
          }
        })

        wrapper.vm.$store.getters['profile/byId'].mockClear()
        wrapper.vm.$store.getters['network/byId'].mockClear()

        wrapper.vm.populateSchema()

        expect(sessionProfileIdSpy).toHaveBeenCalled()
        expect(ledgerConnectedSpy).toHaveBeenCalled()
        expect(ledgerWalletsSpy).toHaveBeenCalled()
        expect(profileAllSpy).toHaveBeenCalled()
        expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-1')
        expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-2')
        expect(wrapper.vm.$store.getters['profile/byId']).not.toHaveBeenCalled()
        expect(wrapper.vm.$store.getters['network/byId']).not.toHaveBeenCalled()
        expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet_fromRoute)
      })

      it('should load data for network with nethash', () => {
        const sessionProfileIdSpy = jest.spyOn(wrapper.vm.$store.getters, 'session/profileId', 'get')
        const ledgerConnectedSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/isConnected', 'get')
        const ledgerWalletsSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/wallets', 'get')
        const profileAllSpy = jest.spyOn(wrapper.vm.$store.getters, 'profile/all', 'get')

        wrapper.setProps({
          schema: {
            wallet: 'address-1',
            nethash: 'nethash-1'
          }
        })

        wrapper.vm.$store.getters['profile/byId'].mockClear()
        wrapper.vm.$store.getters['network/byId'].mockClear()

        wrapper.vm.populateSchema()

        expect(sessionProfileIdSpy).toHaveBeenCalled()
        expect(ledgerConnectedSpy).toHaveBeenCalled()
        expect(ledgerWalletsSpy).toHaveBeenCalled()
        expect(profileAllSpy).toHaveBeenCalled()
        expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-1')
        expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-2')
        expect(wrapper.vm.$store.getters['profile/byId']).toHaveBeenCalledWith('profile-1')
        expect(wrapper.vm.$store.getters['network/byId']).toHaveBeenCalledWith('network-1')
        expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet_fromRoute)
      })

      it('should check other profiles if no current profile', () => {
        const sessionProfileIdSpy = jest.spyOn(wrapper.vm.$store.getters, 'session/profileId', 'get').mockReturnValue(null)
        const ledgerConnectedSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/isConnected', 'get')
        const ledgerWalletsSpy = jest.spyOn(wrapper.vm.$store.getters, 'ledger/wallets', 'get')
        const profileAllSpy = jest.spyOn(wrapper.vm.$store.getters, 'profile/all', 'get')

        wrapper.setProps({
          schema: {
            wallet: 'address-1',
            nethash: 'nethash-1'
          }
        })

        wrapper.vm.$store.getters['profile/byId'].mockClear()
        wrapper.vm.$store.getters['network/byId'].mockClear()

        wrapper.vm.populateSchema()

        expect(sessionProfileIdSpy).toHaveBeenCalled()
        expect(ledgerConnectedSpy).toHaveBeenCalled()
        expect(ledgerWalletsSpy).toHaveBeenCalled()
        expect(profileAllSpy).toHaveBeenCalled()
        expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-1')
        expect(wrapper.vm.$store.getters['wallet/byProfileId']).toHaveBeenCalledWith('profile-2')
        expect(wrapper.vm.$store.getters['profile/byId']).not.toHaveBeenCalled()
        expect(wrapper.vm.$store.getters['network/byId']).toHaveBeenCalledWith('network-1')
        expect(wrapper.vm.currentWallet).toBe(wrapper.vm.wallet_fromRoute)
      })

      it('should error when no network', () => {
        const $tSpy = jest.spyOn(wrapper.vm, '$t')

        wrapper.setProps({
          schema: {
            wallet: 'address-1',
            nethash: 'wrong nethash'
          }
        })

        wrapper.vm.populateSchema()

        expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.NETWORK_NOT_CONFIGURED')
        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.NETWORK_NOT_CONFIGURED: wrong nethash')

        $tSpy.mockRestore()
      })

      it('should error when no wallets', () => {
        const $tSpy = jest.spyOn(wrapper.vm, '$t')

        wrapper.setProps({
          schema: {
            wallet: 'wrong address'
          }
        })

        wrapper.vm.populateSchema()

        expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.WALLET_NOT_IMPORTED')
        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.WALLET_NOT_IMPORTED: wrong address')

        $tSpy.mockRestore()
      })
    })

    describe('transactionError', () => {
      it('should generate error for normal transaction', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.TRANSFER')
      })

      it('should generate error for multipayment transaction', () => {
        wrapper.vm.onSendTypeChange('Multiple')
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-2',
          amount: 10
        }, {
          address: 'address-3',
          amount: 10
        }]

        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.MULTI_PAYMENT')
      })
    })

    describe('emitNext', () => {
      it('should emit', () => {
        wrapper.vm.emitNext({
          recipientId: 'address-2'
        })

        expect(wrapper.emitted('next')).toEqual([
          [{
            transaction: {
              recipientId: 'address-2'
            },
            wallet: wrapper.vm.senderWallet
          }]
        ])
      })

      it('should emit with current wallet', () => {
        wrapper.vm.wallet = {
          address: 'address-1'
        }

        wrapper.vm.emitNext({
          recipientId: 'address-2'
        })

        expect(wrapper.emitted('next')).toEqual([
          [{
            transaction: {
              recipientId: 'address-2'
            },
            wallet: {
              address: 'address-1'
            }
          }]
        ])
      })
    })

    describe('onFee', () => {
      it('should set fee in form', () => {
        wrapper.vm.onFee(20)

        expect(wrapper.vm.form.fee).toEqual(20)
      })

      it('should ensure amount is available', () => {
        const spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount').mockImplementation()

        wrapper.vm.onFee(20)

        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    describe('setSendAll', () => {
      it('should trigger send all', () => {
        const spy = jest.spyOn(wrapper.vm, 'confirmSendAll').mockImplementation()

        wrapper.vm.amount = 50
        wrapper.vm.setSendAll(true)

        expect(spy).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.previousAmount).toEqual(50)
      })

      it('should trigger when disabled', () => {
        const spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount').mockImplementation()

        wrapper.vm.amount = 50
        wrapper.vm.previousAmount = 50
        wrapper.vm.setSendAll(false)

        expect(spy).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.amount).toEqual(50)
        expect(wrapper.vm.previousAmount).toEqual('')
        expect(wrapper.vm.isSendAllActive).toEqual(false)
      })

      it('should not update amount when disabled', () => {
        const spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount').mockImplementation()
        const spySet = jest.spyOn(wrapper.vm, '$set')

        wrapper.vm.amount = 10
        wrapper.vm.previousAmount = 50
        wrapper.vm.setSendAll(false, false)

        expect(spy).toHaveBeenCalled()
        expect(spySet).not.toHaveBeenCalled()
        expect(wrapper.vm.amount).toEqual(10)
        expect(wrapper.vm.previousAmount).toEqual('')
        expect(wrapper.vm.isSendAllActive).toEqual(false)
      })
    })

    describe('ensureAvailableAmount', () => {
      it('should set amount to max if send all is enabled', async () => {
        wrapper.vm.amount = new BigNumber('999.9')
        wrapper.vm.isSendAllActive = true

        await wrapper.vm.$nextTick()

        wrapper.vm.ensureAvailableAmount()

        expect(wrapper.vm.isSendAllActive).toBe(true)
        expect(wrapper.vm.canSendAll).toBe(true)
        expect(wrapper.vm.amount).toEqual(new BigNumber('999.9'))
      })

      it('should not set amount to max if send all is disabled', async () => {
        const spySet = jest.spyOn(wrapper.vm, '$set')

        wrapper.vm.amount = 10

        await wrapper.vm.$nextTick()

        wrapper.vm.ensureAvailableAmount()

        expect(spySet).not.toHaveBeenCalled()
        expect(wrapper.vm.amount).toEqual(10)
      })
    })

    describe('enableSendAll', () => {
      it('should force send all (for when modal is confirmed)', () => {
        const spy = jest.spyOn(wrapper.vm, 'ensureAvailableAmount')

        wrapper.vm.enableSendAll()

        expect(spy).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.isSendAllActive).toBe(true)
        expect(wrapper.vm.showConfirmSendAll).toBe(false)
      })
    })

    describe('confirmSendAll', () => {
      it('should set to true (to show modal)', () => {
        wrapper.vm.confirmSendAll()

        expect(wrapper.vm.showConfirmSendAll).toBe(true)
      })
    })

    describe('cancelSendAll', () => {
      it('should set to false (to hide modal)', () => {
        wrapper.vm.cancelSendAll()

        expect(wrapper.vm.isSendAllActive).toBe(false)
        expect(wrapper.vm.showConfirmSendAll).toBe(false)
      })
    })

    describe('addRecipient', () => {
      it('should add current recipient to list', async () => {
        const address = Identities.Address.fromPassphrase('passphrase')
        wrapper.vm.$v.recipientId.$model = address
        wrapper.vm.$v.amount.$model = 100

        await wrapper.vm.$nextTick()

        wrapper.vm.addRecipient()

        expect(wrapper.vm.$v.form.recipients.$model).toEqual([{
          address: address,
          amount: new BigNumber(100 * 1e8),
          sendAll: false
        }])
      })

      it('should reset current recipient', async () => {
        wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase')
        wrapper.vm.$v.amount.$model = 100

        await wrapper.vm.$nextTick()

        wrapper.vm.addRecipient()

        expect(wrapper.vm.$v.recipientId.$model).toBe('')
        expect(wrapper.vm.$v.amount.$model).toBe('')
      })

      it('should do nothing if invalid address', async () => {
        WalletService.validateAddress.mockReturnValue(false)

        wrapper.vm.$v.recipientId.$model = 'invalid address'
        wrapper.vm.$v.amount.$model = 100

        await wrapper.vm.$nextTick()

        wrapper.vm.addRecipient()

        expect(wrapper.vm.$v.form.recipients.$model).toEqual([])

        WalletService.validateAddress.mockReturnValue(true)
      })

      it('should do nothing if invalid fee', async () => {
        wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase')
        wrapper.vm.$v.amount.$model = ''

        await wrapper.vm.$nextTick()

        wrapper.vm.addRecipient()

        expect(wrapper.vm.$v.form.recipients.$model).toEqual([])
      })
    })

    describe('emitRemoveRecipient', () => {
      it('should remove recipient at index', () => {
        wrapper.vm.$v.form.recipients.$model = [{
          address: 'address-1',
          amount: 10
        }, {
          address: 'address-2',
          amount: 10
        }, {
          address: 'address-3',
          amount: 10
        }]

        wrapper.vm.emitRemoveRecipient(1)

        expect(wrapper.vm.$v.form.recipients.$model).toEqual([{
          address: 'address-1',
          amount: 10
        }, {
          address: 'address-3',
          amount: 10
        }])
      })

      it('should do nothing if index does not exist', () => {
        const recipients = [{
          address: 'address-1',
          amount: 10
        }, {
          address: 'address-2',
          amount: 10
        }]

        wrapper.vm.$v.form.recipients.$model = recipients

        wrapper.vm.emitRemoveRecipient(3)

        expect(wrapper.vm.$v.form.recipients.$model).toBe(recipients)
      })
    })

    describe('nextStep', () => {
      it('should submit form data', async () => {
        const spy = jest.spyOn(wrapper.vm, 'onSubmit').mockImplementation()

        await wrapper.vm.nextStep()

        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    describe('loadTransaction', () => {
      let $tSpy
      beforeEach(() => {
        $tSpy = jest.spyOn(wrapper.vm, '$t')
      })

      afterEach(() => {
        $tSpy.mockRestore()
      })

      describe('when a valid JSON file is opened', () => {
        it('should display an error alert if the transaction has the wrong type', async () => {
          wrapper.vm.electron_readFile = jest.fn(async () => {
            return '{ "type": "1" }'
          })

          await wrapper.vm.loadTransaction()

          expect($tSpy).toHaveBeenCalledWith('VALIDATION.INVALID_TYPE')
          expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE')
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: VALIDATION.INVALID_TYPE')
        })

        it('should display an error alert if the recipient is on a different network', async () => {
          WalletService.validateAddress = jest.fn(() => false)

          wrapper.vm.electron_readFile = jest.fn(async () => {
            return '{ "type": "0", "recipientId": "AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm", "amount": "10" }'
          })

          await wrapper.vm.loadTransaction()

          expect($tSpy).toHaveBeenCalledWith('VALIDATION.RECIPIENT_DIFFERENT_NETWORK', [
            'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm'
          ])
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: VALIDATION.RECIPIENT_DIFFERENT_NETWORK')
        })

        it('should set data from json', async () => {
          WalletService.validateAddress = jest.fn(() => true)

          const json = JSON.stringify({
            type: 0,
            recipientId: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
            fee: (0.1 * 1e8).toString(),
            amount: (20 * 1e8).toString(),
            vendorField: 'vendorfield test'
          })

          wrapper.vm.electron_readFile = jest.fn(async () => {
            return json
          })

          await wrapper.vm.loadTransaction()

          expect($tSpy).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE')
          expect(wrapper.vm.$success).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE')
          expect(wrapper.vm.recipientId).toEqual('AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm')
          expect(wrapper.vm.amount).toEqual('20')
          expect(wrapper.vm.form.fee).toEqual('0.1')
          expect(wrapper.vm.form.vendorField).toEqual('vendorfield test')
        })

        it('should display a success alert', async () => {
          const json = JSON.stringify({
            type: 0,
            recipientId: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
            amount: (20 * 1e8).toString()
          })

          wrapper.vm.electron_readFile = jest.fn(async () => {
            return json
          })

          await wrapper.vm.loadTransaction()

          expect($tSpy).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE')
          expect(wrapper.vm.$success).toHaveBeenCalledWith('TRANSACTION.SUCCESS.LOAD_FROM_FILE')
        })
      })

      describe('when an invalid JSON file is opened', () => {
        it('should display an error alert', async () => {
          wrapper.vm.electron_readFile = jest.fn(async () => {
            return 'invalid json'
          })

          await wrapper.vm.loadTransaction()

          expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE')
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: VALIDATION.INVALID_FORMAT')
        })

        it('should display an error alert when error thrown', async () => {
          wrapper.vm.electron_readFile = jest.fn(async () => {
            throw new Error('invalid json')
          })

          await wrapper.vm.loadTransaction()

          expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE')
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.LOAD_FROM_FILE: invalid json')
        })
      })
    })
  })

  describe('validations', () => {
    describe('recipientId', () => {
      it('should be required if not set', () => {
        wrapper.vm.$v.recipientId.$model = ''

        expect(wrapper.vm.$v.recipientId.required).toBe(false)
      })

      it('should not be required if set', () => {
        wrapper.vm.$v.recipientId.$model = 'test'

        expect(wrapper.vm.$v.recipientId.required).toBe(true)
      })

      it('should not be valid', async () => {
        WalletService.validateAddress.mockReturnValue(false)

        wrapper.vm.$v.recipientId.$model = 'test'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.recipient.$v.$invalid).toBe(true)
        expect(wrapper.vm.$v.recipientId.isValid).toBe(false)

        WalletService.validateAddress.mockReturnValue(true)
      })

      it('should not be valid if no recipient field', async () => {
        wrapper.vm.$refs.recipient = null
        wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase')

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.recipient).toBe(null)
        expect(wrapper.vm.$v.recipientId.isValid).toBe(false)
      })

      it('should be valid', async () => {
        wrapper.vm.$v.recipientId.$model = Identities.Address.fromPassphrase('passphrase')

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.recipient.$v.$invalid).toBe(false)
        expect(wrapper.vm.$v.recipientId.isValid).toBe(true)
      })
    })

    describe('amount', () => {
      it('should be required if not set', () => {
        wrapper.vm.$v.amount.$model = ''

        expect(wrapper.vm.$v.amount.required).toBe(false)
      })

      it('should not be required if set', () => {
        wrapper.vm.$v.amount.$model = '10'

        expect(wrapper.vm.$v.amount.required).toBe(true)
      })

      it('should not be valid', async () => {
        wrapper.vm.$v.amount.$model = 'test'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.amount.$v.$invalid).toBe(true)
        expect(wrapper.vm.$v.amount.isValid).toBe(false)
      })

      it('should not be valid if no amount field', async () => {
        wrapper.vm.$refs.amount = null
        wrapper.vm.$v.amount.$model = 'test'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.amount).toBe(null)
        expect(wrapper.vm.$v.amount.isValid).toBe(false)
      })

      it('should be valid', async () => {
        wrapper.vm.$v.amount.$model = 10

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.amount.$v.$invalid).toBe(false)
        expect(wrapper.vm.$v.amount.isValid).toBe(true)
      })
    })

    describe('form', () => {
      describe('recipients', () => {
        it('should not be above minimum if not set', () => {
          wrapper.vm.$v.form.recipients.$model = []

          expect(wrapper.vm.$v.form.recipients.aboveMinimum).toBe(false)
        })

        it('should be above minimum if set', () => {
          wrapper.vm.onSendTypeChange('Multiple')
          wrapper.vm.$v.form.recipients.$model = [{
            address: 'address-1',
            amount: 10
          }, {
            address: 'address-1',
            amount: 10
          }]

          expect(wrapper.vm.$v.form.recipients.aboveMinimum).toBe(true)
        })

        it('should not be below or equal to maximum if too many', () => {
          const network = {
            ...cloneDeep(globalNetwork),
            constants: {
              multiPaymentLimit: 2
            }
          }

          createWrapper(null, undefined, network)

          wrapper.vm.$v.form.recipients.$model = [{
            address: 'address-1',
            amount: 10
          }, {
            address: 'address-1',
            amount: 10
          }, {
            address: 'address-1',
            amount: 10
          }]

          expect(wrapper.vm.$v.form.recipients.belowOrEqualMaximum).toBe(false)
        })

        it('should be below or equal to maximum if set', () => {
          wrapper.vm.$v.form.recipients.$model = [{
            address: 'address-1',
            amount: 10
          }]

          expect(wrapper.vm.$v.form.recipients.belowOrEqualMaximum).toBe(true)
        })
      })
    })
  })
})
