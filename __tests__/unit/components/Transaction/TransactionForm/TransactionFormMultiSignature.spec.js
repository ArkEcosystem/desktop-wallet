import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import cloneDeep from 'lodash/cloneDeep'
import installI18n from '../../../__utils__/i18n'
import { TransactionFormMultiSignature } from '@/components/Transaction/TransactionForm'
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
  nethash: 'nethash-1'
})

let wrapper
const createWrapper = (component, wallet, network, props = {}) => {
  component = component || TransactionFormMultiSignature

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

  if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'publicKey')) {
    wallet.publicKey = 'public-key-1'
  }

  if (wallet && !Object.prototype.hasOwnProperty.call(wallet, 'balance')) {
    wallet.balance = (1000 * 1e8).toString()
  }

  const mountNetwork = network || cloneDeep(globalNetwork)

  wrapper = mount(TransactionFormMultiSignature, {
    i18n,
    localVue,
    sync: false,
    propsData: props,
    mocks: {
      $client: {
        buildMultiSignature: jest.fn((transactionData) => transactionData),
        fetchWallet: jest.fn((address) => ({
          address,
          publicKey: address.replace('address', 'public-key')
        }))
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
          'wallet/byAddress': jest.fn((address) => ({
            address,
            publicKey: address.replace('address', 'public-key')
          })),
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

describe('TransactionFormMultiSignature', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have multi-payment transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(4)
  })

  describe('data', () => {
    it('should has properties', () => {
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'step')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'currentTab')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'address')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'publicKey')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data, 'form')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'publicKeys')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'minKeys')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'fee')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'passphrase')).toBe(true)
      expect(Object.prototype.hasOwnProperty.call(wrapper.vm._data.form, 'walletPassword')).toBe(true)
    })
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormMultiSignature')).toBe(true)
    })

    describe('step 1', () => {
      it('should have add button', () => {
        expect(wrapper.contains('.TransactionFormMultiSignature__add')).toBe(true)
      })

      describe('address tab', () => {
        beforeEach(() => {
          wrapper.vm.currentTab = 0
        })

        it('should have address field', () => {
          expect(wrapper.contains('.TransactionFormMultiSignature__address')).toBe(true)
        })
      })

      describe('public key tab', () => {
        beforeEach(() => {
          wrapper.vm.currentTab = 1
        })

        it('should have address field', () => {
          expect(wrapper.contains('.TransactionFormMultiSignature__public-key')).toBe(true)
        })
      })
    })

    describe('step 2', () => {
      beforeEach(() => {
        wrapper.vm.step = 2
      })

      it('should have fee field', () => {
        expect(wrapper.contains('.TransactionFormMultiSignature__fee')).toBe(true)
      })

      describe('ledger notice', () => {
        it('should show if wallet is a ledger', async () => {
          createWrapper(null, {
            isLedger: true
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormMultiSignature__ledger-notice')).toBe(true)
        })

        it('should show if wallet is not a ledger', async () => {
          createWrapper(null, {
            isLedger: false
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormMultiSignature__ledger-notice')).toBe(false)
        })
      })

      describe('password field', () => {
        it('should show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormMultiSignature__password')).toBe(true)
        })

        it('should not show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormMultiSignature__password')).toBe(false)
        })
      })

      describe('passphrase field', () => {
        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormMultiSignature__passphrase')).toBe(true)
        })

        it('should not show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2

          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormMultiSignature__passphrase')).toBe(false)
        })
      })
    })

    describe('prev button', () => {
      it('should be enabled if on second form', async () => {
        wrapper.vm.step = 2

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormMultiSignature__prev').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if on step 1', async () => {
        wrapper.vm.step = 1

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormMultiSignature__prev').attributes('disabled')).toBe('disabled')
      })
    })

    describe('next button', () => {
      it('should be enabled if recipients form is valid', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormMultiSignature__next').attributes('disabled')).toBeFalsy()
      })

      it('should be enabled if both forms are valid', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormMultiSignature__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is invalid', async () => {
        wrapper.vm.$v.form.$touch()

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormMultiSignature__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('computed', () => {
    describe('addressTab', () => {
      it('should return true if 0', () => {
        wrapper.vm.currentTab = 0

        expect(wrapper.vm.addressTab).toBe(true)
      })

      it('should return false if 1', () => {
        wrapper.vm.currentTab = 1

        expect(wrapper.vm.addressTab).toBe(false)
      })
    })

    describe('publicKeyTab', () => {
      it('should return true if 1', () => {
        wrapper.vm.currentTab = 1

        expect(wrapper.vm.publicKeyTab).toBe(true)
      })

      it('should return false if 0', () => {
        wrapper.vm.currentTab = 0

        expect(wrapper.vm.publicKeyTab).toBe(false)
      })
    })

    describe('tabs', () => {
      it('should return tabs', () => {
        expect(wrapper.vm.tabs).toEqual([
          {
            text: 'TRANSACTION.MULTI_SIGNATURE.TAB.ADDRESS'
          },
          {
            text: 'TRANSACTION.MULTI_SIGNATURE.TAB.PUBLIC_KEY'
          }
        ])
      })
    })

    describe('validStep1', () => {
      describe('addressTab', () => {
        beforeEach(() => {
          wrapper.vm.currentTab = 0
        })

        it('should return false if address not dirty', () => {
          wrapper.vm.$v.address.$model = Identities.Address.fromPassphrase('passphrase')
          wrapper.vm.$v.address.$reset()

          expect(wrapper.vm.$v.address.$dirty).toBe(false)
          expect(wrapper.vm.$v.address.$invalid).toBe(false)
          expect(wrapper.vm.addressWarning).toBeFalsy()
          expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(false)
          expect(wrapper.vm.validStep1).toBe(false)
        })

        it('should return false if address is invalid', async () => {
          WalletService.validateAddress.mockReturnValue(false)

          wrapper.vm.$v.address.$model = 'wut'

          await wrapper.vm.$nextTick()

          expect(wrapper.vm.$v.address.$dirty).toBe(true)
          expect(wrapper.vm.$v.address.$invalid).toBe(true)
          expect(wrapper.vm.addressWarning).toBeFalsy()
          expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(false)
          expect(wrapper.vm.validStep1).toBe(false)

          WalletService.validateAddress.mockReturnValue(true)
        })

        it('should return false if address warning', () => {
          const address = Identities.Address.fromPassphrase('passphrase')
          wrapper.vm.$v.address.$model = address
          wrapper.vm.form.publicKeys = [{
            address: address,
            publicKey: 'public-key-2'
          }]

          expect(wrapper.vm.$v.address.$dirty).toBe(true)
          expect(wrapper.vm.$v.address.$invalid).toBe(false)
          expect(wrapper.vm.addressWarning).toBeTruthy()
          expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(false)
          expect(wrapper.vm.validStep1).toBe(false)
        })

        it('should return false if address is empty', () => {
          wrapper.vm.$v.address.$model = ''

          expect(wrapper.vm.$v.address.$dirty).toBe(true)
          expect(wrapper.vm.$v.address.$invalid).toBe(false)
          expect(wrapper.vm.addressWarning).toBeFalsy()
          expect(wrapper.vm.address.replace(/\s+/, '') === '').toBe(true)
          expect(wrapper.vm.validStep1).toBe(false)
        })
      })

      describe('publicKeyTab', () => {
        beforeEach(() => {
          wrapper.vm.currentTab = 1
        })

        it('should return false if publicKey not dirty', () => {
          wrapper.vm.$v.publicKey.$model = Identities.PublicKey.fromPassphrase('passphrase')
          wrapper.vm.$v.publicKey.$reset()

          expect(wrapper.vm.$v.publicKey.$dirty).toBe(false)
          expect(wrapper.vm.$v.publicKey.$invalid).toBe(false)
          expect(wrapper.vm.publicKeyWarning).toBeFalsy()
          expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(false)
          expect(wrapper.vm.validStep1).toBe(false)
        })

        it('should return false if publicKey is invalid', async () => {
          wrapper.vm.$v.publicKey.$model = 'wut'

          await wrapper.vm.$nextTick()

          expect(wrapper.vm.$v.publicKey.$dirty).toBe(true)
          expect(wrapper.vm.$v.publicKey.$invalid).toBe(true)
          expect(wrapper.vm.publicKeyWarning).toBeFalsy()
          expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(false)
          expect(wrapper.vm.validStep1).toBe(false)
        })

        it('should return false if publicKey warning', () => {
          const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
          wrapper.vm.$v.publicKey.$model = publicKey
          wrapper.vm.form.publicKeys = [{
            address: 'address-2',
            publicKey: publicKey
          }]

          expect(wrapper.vm.$v.publicKey.$dirty).toBe(true)
          expect(wrapper.vm.$v.publicKey.$invalid).toBe(false)
          expect(wrapper.vm.publicKeyWarning).toBeTruthy()
          expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(false)
          expect(wrapper.vm.validStep1).toBe(false)
        })

        it('should return false if publicKey is empty', () => {
          wrapper.vm.$v.publicKey.$model = ''

          expect(wrapper.vm.$v.publicKey.$dirty).toBe(true)
          expect(wrapper.vm.$v.publicKey.$invalid).toBe(false)
          expect(wrapper.vm.publicKeyWarning).toBeFalsy()
          expect(wrapper.vm.publicKey.replace(/\s+/, '') === '').toBe(true)
          expect(wrapper.vm.validStep1).toBe(false)
        })
      })
    })

    describe('isFormValid', () => {
      it('should return true if valid step 1', () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]

        expect(wrapper.vm.isFormValid).toBe(true)
      })

      it('should return false if valid step 1 and no keys', () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.publicKeys.$model = []

        expect(wrapper.vm.isFormValid).toBe(false)
      })

      it('should return true if valid step 2', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
        wrapper.vm.$v.form.minKeys.$model = 2
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isFormValid).toBe(true)
      })

      it('should return false if valid step 1 and no keys', () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]

        expect(wrapper.vm.isFormValid).toBe(false)
      })
    })

    describe('addressWarning', () => {
      it('should return null if not dirty', () => {
        wrapper.vm.$v.address.$reset()

        expect(wrapper.vm.$v.address.$dirty).toBe(false)
        expect(wrapper.vm.addressWarning).toBe(null)
      })

      it('should return null if not duplicate', () => {
        wrapper.vm.form.publicKeys = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
        wrapper.vm.$v.address.$model = 'address-1'

        expect(wrapper.vm.$v.address.$dirty).toBe(true)
        expect(wrapper.vm.addressWarning).toBe(null)
      })

      it('should return error if duplicate', () => {
        wrapper.vm.form.publicKeys = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
        wrapper.vm.$v.address.$model = 'address-2'

        expect(wrapper.vm.$v.address.$dirty).toBe(true)
        expect(wrapper.vm.addressWarning).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_DUPLICATE')
      })
    })

    describe('publicKeyWarning', () => {
      it('should return null if not dirty', () => {
        wrapper.vm.$v.publicKey.$reset()

        expect(wrapper.vm.$v.publicKey.$dirty).toBe(false)
        expect(wrapper.vm.publicKeyWarning).toBe(null)
      })

      it('should return null if not duplicate', () => {
        wrapper.vm.form.publicKeys = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
        wrapper.vm.$v.publicKey.$model = 'public-key-1'

        expect(wrapper.vm.$v.publicKey.$dirty).toBe(true)
        expect(wrapper.vm.publicKeyWarning).toBe(null)
      })

      it('should return error if duplicate', () => {
        wrapper.vm.form.publicKeys = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
        wrapper.vm.$v.publicKey.$model = 'public-key-2'

        expect(wrapper.vm.$v.publicKey.$dirty).toBe(true)
        expect(wrapper.vm.publicKeyWarning).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_DUPLICATE')
      })
    })

    describe('maximumPublicKeys', () => {
      it('should return default if no constants', () => {
        expect(wrapper.vm.maximumPublicKeys).toBe(16)
      })

      it('should return default if no network value', () => {
        const network = {
          ...cloneDeep(globalNetwork),
          constants: {}
        }

        createWrapper(null, undefined, network)

        expect(wrapper.vm.maximumPublicKeys).toBe(16)
      })

      it('should return network constant', () => {
        const network = {
          ...cloneDeep(globalNetwork),
          constants: {
            maxMultiSignatureParticipants: 20
          }
        }

        createWrapper(null, undefined, network)

        expect(wrapper.vm.maximumPublicKeys).toBe(20)
      })
    })

    describe('minKeysError', () => {
      beforeEach(() => {
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]
      })

      it('should return null if valid value', async () => {
        wrapper.vm.$v.form.minKeys.$model = 1

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.minKeysError).toBe(null)
      })

      it('should return error if empty value', async () => {
        wrapper.vm.$v.form.minKeys.$model = ''

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.minKeysError).toBe('VALIDATION.REQUIRED')
      })

      it('should return error if above maximum', async () => {
        wrapper.vm.$v.form.minKeys.$model = 4

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.minKeysError).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_MIN_KEYS_TOO_HIGH')
      })

      it('should return error if below minimum', async () => {
        wrapper.vm.$v.form.minKeys.$model = 0

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.minKeysError).toBe('TRANSACTION.MULTI_SIGNATURE.ERROR_MIN_KEYS_TOO_LOW')
      })
    })
  })

  describe('mounted hook', () => {
    it('should add current wallet to public keys', () => {
      expect(wrapper.vm.form.publicKeys).toEqual([{
        address: 'address-1',
        publicKey: 'public-key-1'
      }])
    })

    it('should update min keys', () => {
      const updateMinKeysOriginal = TransactionFormMultiSignature.methods.updateMinKeys
      TransactionFormMultiSignature.methods.updateMinKeys = jest.fn()

      createWrapper()

      expect(TransactionFormMultiSignature.methods.updateMinKeys).toHaveBeenCalledTimes(1)

      TransactionFormMultiSignature.methods.updateMinKeys = updateMinKeysOriginal
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase', () => {
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.minKeys.$model = 3
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }, {
          address: 'address-4',
          publicKey: 'public-key-4'
        }]

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          publicKeys: [
            'public-key-2',
            'public-key-3',
            'public-key-4'
          ],
          minKeys: 3,
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170
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
        wrapper.vm.$v.form.minKeys.$model = 3
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }, {
          address: 'address-4',
          publicKey: 'public-key-4'
        }]

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          secondPassphrase: 'second passphrase',
          publicKeys: [
            'public-key-2',
            'public-key-3',
            'public-key-4'
          ],
          minKeys: 3,
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build multi-signature', async () => {
        const transactionData = {
          type: 6,
          typeGroup: 1,
          asset: {
            multiSignature: {}
          }
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildMultiSignature).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build multi-signature with default arguments', async () => {
        const transactionData = {
          type: 6,
          typeGroup: 1,
          asset: {
            multiSignature: {}
          }
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildMultiSignature).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.MULTI_SIGNATURE')
      })
    })

    describe('addPublicKey', () => {
      beforeEach(() => {
        wrapper.vm.form.publicKeys = []
      })

      describe('addressTab', () => {
        beforeEach(() => {
          wrapper.vm.currentTab = 0
        })

        it('should get wallet from store', async () => {
          const spy = jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress')

          wrapper.vm.address = 'address-4'

          await wrapper.vm.addPublicKey()

          expect(spy).toHaveBeenCalledWith('address-4')
          expect(wrapper.vm.form.publicKeys).toEqual([{
            address: 'address-4',
            publicKey: 'public-key-4'
          }])
        })

        it('should check api for wallet', async () => {
          jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress').mockReturnValue(null)
          const spy = jest.spyOn(wrapper.vm.$client, 'fetchWallet')

          wrapper.vm.address = 'address-4'

          await wrapper.vm.addPublicKey()

          expect(spy).toHaveBeenCalledWith('address-4')
          expect(wrapper.vm.form.publicKeys).toEqual([{
            address: 'address-4',
            publicKey: 'public-key-4'
          }])
        })

        it('should error if no wallet', async () => {
          jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress').mockReturnValue(null)
          jest.spyOn(wrapper.vm.$client, 'fetchWallet').mockReturnValue(null)
          const spy = jest.spyOn(wrapper.vm, '$error')

          wrapper.vm.address = 'address-4'

          await wrapper.vm.addPublicKey()

          expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_NOT_FOUND')
          expect(wrapper.vm.form.publicKeys).toEqual([])
        })

        it('should error if duplicate entry', async () => {
          wrapper.vm.form.publicKeys = [{
            address: 'address-4',
            publicKey: 'public-key-4'
          }]

          jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress')
          const spy = jest.spyOn(wrapper.vm, '$error')

          wrapper.vm.address = 'address-4'

          await wrapper.vm.addPublicKey()

          expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_EXISTS')
          expect(wrapper.vm.form.publicKeys).toEqual([{
            address: 'address-4',
            publicKey: 'public-key-4'
          }])
        })

        it('should update duplicate entry if only has public key', async () => {
          wrapper.vm.form.publicKeys = [{
            address: null,
            publicKey: 'public-key-4'
          }]

          jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress')
          const spy = jest.spyOn(wrapper.vm, '$error')

          wrapper.vm.address = 'address-4'

          await wrapper.vm.addPublicKey()

          expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_EXISTS')
          expect(wrapper.vm.form.publicKeys).toEqual([{
            address: 'address-4',
            publicKey: 'public-key-4'
          }])
        })

        it('should reset field', async () => {
          wrapper.vm.$v.address.$model = 'address-4'

          await wrapper.vm.addPublicKey()
          await wrapper.vm.$nextTick()

          expect(wrapper.vm.$refs.address.$v.$dirty).toBe(false)
          expect(wrapper.vm.$v.address.$model).toBe('')
        })
      })

      describe('publicKeyTab', () => {
        beforeEach(() => {
          wrapper.vm.currentTab = 1
        })

        it('should store public key', async () => {
          wrapper.vm.publicKey = 'public-key-4'

          await wrapper.vm.addPublicKey()

          expect(wrapper.vm.form.publicKeys).toEqual([{
            address: null,
            publicKey: 'public-key-4'
          }])
        })

        it('should error if duplicate entry', async () => {
          wrapper.vm.form.publicKeys = [{
            address: 'address-4',
            publicKey: 'public-key-4'
          }]

          jest.spyOn(wrapper.vm.$store.getters, 'wallet/byAddress')
          const spy = jest.spyOn(wrapper.vm, '$error')

          wrapper.vm.publicKey = 'public-key-4'

          await wrapper.vm.addPublicKey()

          expect(spy).toHaveBeenCalledWith('TRANSACTION.MULTI_SIGNATURE.ERROR_PUBLIC_KEY_EXISTS')
          expect(wrapper.vm.form.publicKeys).toEqual([{
            address: 'address-4',
            publicKey: 'public-key-4'
          }])
        })

        it('should reset field', async () => {
          wrapper.vm.$v.publicKey.$model = 'public-key-4'

          await wrapper.vm.addPublicKey()
          await wrapper.vm.$nextTick()

          expect(wrapper.vm.$refs.publicKey.$v.$dirty).toBe(false)
          expect(wrapper.vm.$v.publicKey.$model).toBe('')
        })
      })
    })

    describe('updateMinKeys', () => {
      it('should update min keys to be length of public keys', () => {
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }, {
          address: 'address-4',
          publicKey: 'public-key-4'
        }]
        wrapper.vm.$v.form.minKeys.$model = 1

        wrapper.vm.updateMinKeys()

        expect(wrapper.vm.$v.form.minKeys.$model).toBe(3)
      })
    })

    describe('previousStep', () => {
      it('should go from step 2 to step 1', () => {
        wrapper.vm.step = 2

        wrapper.vm.previousStep()

        expect(wrapper.vm.step).toBe(1)
      })

      it('should do nothing on step 1', () => {
        wrapper.vm.step = 1

        wrapper.vm.previousStep()

        expect(wrapper.vm.step).toBe(1)
      })
    })

    describe('nextStep', () => {
      it('should go from step 1 to step 2', () => {
        wrapper.vm.step = 1

        wrapper.vm.nextStep()

        expect(wrapper.vm.step).toBe(2)
      })

      it('should submit form data on step 2', async () => {
        const spy = jest.spyOn(wrapper.vm, 'onSubmit').mockImplementation()

        wrapper.vm.step = 2

        await wrapper.vm.$nextTick()

        wrapper.vm.nextStep()

        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    describe('emitRemovePublicKey', () => {
      it('should remove recipient at index', () => {
        wrapper.vm.$v.form.publicKeys.$model = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }, {
          address: 'address-4',
          publicKey: 'public-key-4'
        }]

        wrapper.vm.emitRemovePublicKey(1)

        expect(wrapper.vm.$v.form.publicKeys.$model).toEqual([{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-4',
          publicKey: 'public-key-4'
        }])
      })

      it('should do nothing if index does not exist', () => {
        const publicKeys = [{
          address: 'address-2',
          publicKey: 'public-key-2'
        }, {
          address: 'address-3',
          publicKey: 'public-key-3'
        }]

        wrapper.vm.$v.form.publicKeys.$model = publicKeys

        wrapper.vm.emitRemovePublicKey(3)

        expect(wrapper.vm.$v.form.publicKeys.$model).toEqual(publicKeys)
      })
    })
  })

  describe('validations', () => {
    describe('publicKey', () => {
      beforeEach(() => {
        wrapper.vm.currentTab = 1
      })

      it('should not be valid', async () => {
        wrapper.vm.$v.publicKey.$model = 'test'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.publicKey.$v.$invalid).toBe(true)
        expect(wrapper.vm.$v.publicKey.isValid).toBe(false)
      })

      it('should not be valid if no publicKey field', async () => {
        wrapper.vm.$refs.publicKey = null
        wrapper.vm.$v.publicKey.$model = Identities.Address.fromPassphrase('passphrase')

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.publicKey).toBe(null)
        expect(wrapper.vm.$v.publicKey.isValid).toBe(false)
      })

      it('should be valid', async () => {
        wrapper.vm.$v.publicKey.$model = Identities.PublicKey.fromPassphrase('passphrase')

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.publicKey.$v.$invalid).toBe(false)
        expect(wrapper.vm.$v.publicKey.isValid).toBe(true)
      })
    })

    describe('address', () => {
      beforeEach(() => {
        wrapper.vm.currentTab = 0
      })

      it('should not be valid', async () => {
        WalletService.validateAddress.mockReturnValue(false)

        wrapper.vm.$v.address.$model = 'test'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.address.$v.$invalid).toBe(true)
        expect(wrapper.vm.$v.address.isValid).toBe(false)

        WalletService.validateAddress.mockReturnValue(true)
      })

      it('should not be valid if no address field', async () => {
        wrapper.vm.$refs.address = null
        wrapper.vm.$v.address.$model = Identities.Address.fromPassphrase('passphrase')

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.address).toBe(null)
        expect(wrapper.vm.$v.address.isValid).toBe(false)
      })

      it('should be valid', async () => {
        wrapper.vm.$v.address.$model = Identities.Address.fromPassphrase('passphrase')

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$refs.address.$v.$invalid).toBe(false)
        expect(wrapper.vm.$v.address.isValid).toBe(true)
      })
    })

    describe('form', () => {
      describe('publicKeys', () => {
        it('should not be notEmpty', () => {
          wrapper.vm.$v.form.publicKeys.$model = [{
            address: 'address-1',
            publicKey: 'public-key-1'
          }]

          expect(wrapper.vm.$v.form.publicKeys.notEmpty).toBe(true)
        })

        it('should be notEmpty', () => {
          wrapper.vm.$v.form.publicKeys.$model = []

          expect(wrapper.vm.$v.form.publicKeys.notEmpty).toBe(false)
        })

        it('should not be above minimum if not set', () => {
          wrapper.vm.$v.form.publicKeys.$model = []

          expect(wrapper.vm.$v.form.publicKeys.aboveMinimum).toBe(false)
        })

        it('should not be above minimum if not enough', () => {
          wrapper.vm.$v.form.publicKeys.$model = [{
            address: 'address-2',
            publicKey: 'public-key-2'
          }]

          expect(wrapper.vm.$v.form.publicKeys.aboveMinimum).toBe(false)
        })

        it('should be above minimum if set', () => {
          wrapper.vm.$v.form.publicKeys.$model = [{
            address: 'address-2',
            publicKey: 'public-key-2'
          }, {
            address: 'address-3',
            publicKey: 'public-key-3'
          }]

          expect(wrapper.vm.$v.form.publicKeys.aboveMinimum).toBe(true)
        })

        it('should not be below maximum if too many', () => {
          const network = {
            ...cloneDeep(globalNetwork),
            constants: {
              maxMultiSignatureParticipants: 2
            }
          }

          createWrapper(null, undefined, network)

          wrapper.vm.$v.form.publicKeys.$model = [{
            address: 'address-2',
            publicKey: 'public-key-2'
          }, {
            address: 'address-3',
            publicKey: 'public-key-3'
          }, {
            address: 'address-4',
            publicKey: 'public-key-4'
          }]

          expect(wrapper.vm.$v.form.publicKeys.belowMaximum).toBe(false)
        })

        it('should be below maximum if set', () => {
          wrapper.vm.$v.form.publicKeys.$model = [{
            address: 'address-2',
            publicKey: 'public-key-2'
          }]

          expect(wrapper.vm.$v.form.publicKeys.belowMaximum).toBe(true)
        })
      })

      describe('minKeys', () => {
        it('should be required if not set', () => {
          wrapper.vm.$v.form.minKeys.$model = ''

          expect(wrapper.vm.$v.form.minKeys.required).toBe(false)
        })

        it('should not be required if set', () => {
          wrapper.vm.$v.form.minKeys.$model = 1

          expect(wrapper.vm.$v.form.minKeys.required).toBe(true)
        })

        it('should not be above minimum if not set', () => {
          wrapper.vm.$v.form.minKeys.$model = ''

          expect(wrapper.vm.$v.form.minKeys.aboveMinimum).toBe(false)
        })

        it('should not be above minimum if not enough', () => {
          wrapper.vm.$v.form.minKeys.$model = 0

          expect(wrapper.vm.$v.form.minKeys.aboveMinimum).toBe(false)
        })

        it('should be above minimum if set', () => {
          wrapper.vm.$v.form.minKeys.$model = 1

          expect(wrapper.vm.$v.form.minKeys.aboveMinimum).toBe(true)
        })

        it('should not be below maximum if too many', () => {
          wrapper.vm.$v.form.minKeys.$model = [{
            address: 'address-2',
            publicKey: 'public-key-2'
          }, {
            address: 'address-3',
            publicKey: 'public-key-3'
          }]
          wrapper.vm.$v.form.minKeys.$model = 3

          expect(wrapper.vm.$v.form.minKeys.belowMaximum).toBe(false)
        })

        it('should be below maximum if set', () => {
          wrapper.vm.$v.form.publicKeys.$model = [{
            address: 'address-2',
            publicKey: 'public-key-2'
          }, {
            address: 'address-3',
            publicKey: 'public-key-3'
          }]
          wrapper.vm.$v.form.minKeys.$model = 2

          expect(wrapper.vm.$v.form.minKeys.belowMaximum).toBe(true)
        })
      })
    })
  })
})
