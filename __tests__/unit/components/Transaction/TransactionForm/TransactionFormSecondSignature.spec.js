import { createLocalVue, mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import installI18n from '../../../__utils__/i18n'
import { TransactionFormSecondSignature } from '@/components/Transaction/TransactionForm'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'
import BigNumber from '@/plugins/bignumber'
import WalletService from '@/services/wallet'

const localVue = createLocalVue()
localVue.use(Vuelidate)
const i18n = installI18n(localVue)

const network = {
  token: 'ARK',
  symbol: 'ARK',
  fractionDigits: 8,
  version: 23,
  wif: 170,
  market: {
    enabled: false
  },
  knownWallets: {}
}

let wrapper
const createWrapper = (component, wallet) => {
  component = component || TransactionFormSecondSignature
  wallet = wallet || {
    address: 'address-1',
    secondPublicKey: false
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
        buildSecondSignatureRegistration: jest.fn((transactionData) => transactionData)
      },
      $error: jest.fn(),
      $store: {
        getters: {
          'transaction/staticFee': jest.fn(() => null),
          'session/lastFeeByType': jest.fn(() => (1 * 1e8).toString()),
          'session/network': network,
          'network/byToken': jest.fn(() => network)
        }
      },
      $synchronizer: {
        appendFocus: jest.fn()
      },
      session_profile: {
        bip39Language: 'EN'
      },
      session_network: network,
      currency_format: jest.fn(CurrencyMixin.methods.currency_format),
      currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
      currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
      currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
      formatter_percentage: jest.fn(FormatterMixin.methods.formatter_percentage),
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_fromRoute: wallet
    },
    stubs: {
      Portal: true
    }
  })
}

describe('TransactionFormSecondSignature', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have second signature transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(1)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormSecondSignature')).toBe(true)
    })

    describe('step 1', () => {
      it('should have step 1', () => {
        expect(wrapper.vm.isPassphraseStep).toBe(false)
        expect(wrapper.find('.TransactionFormSecondSignature__step-1').props('isOpen')).toBe(true)
      })

      it('should have passphrase words', () => {
        expect(wrapper.vm.isPassphraseStep).toBe(false)
        expect(wrapper.contains('.TransactionFormSecondSignature__passphrase-words')).toBe(true)
      })

      it('should have next button', () => {
        expect(wrapper.vm.isPassphraseStep).toBe(false)
        expect(wrapper.contains('.TransactionFormSecondSignature__step-1__next')).toBe(true)
      })
    })

    describe('passphrase step', () => {
      beforeEach(() => {
        wrapper.vm.isPassphraseStep = true
      })

      it('should hide passphrase words when on passphrase step', () => {
        expect(wrapper.find('.TransactionFormSecondSignature__step-1').props('isOpen')).toBe(false)
      })

      it('should have passphrase verification field', () => {
        expect(wrapper.contains('.TransactionFormSecondSignature__passphrase-verification')).toBe(true)
      })

      it('should have fee field', () => {
        expect(wrapper.contains('.TransactionFormSecondSignature__fee')).toBe(true)
      })

      describe('ledger notice', () => {
        it('should show if wallet is a ledger', () => {
          createWrapper(null, {
            isLedger: true
          })

          expect(wrapper.contains('.TransactionFormSecondSignature__ledger-notice')).toBe(true)
        })

        it('should show if wallet is not a ledger', () => {
          createWrapper(null, {
            isLedger: false
          })

          expect(wrapper.contains('.TransactionFormSecondSignature__ledger-notice')).toBe(false)
        })
      })

      describe('password field', () => {
        it('should show if wallet does have a password', () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          expect(wrapper.contains('.TransactionFormSecondSignature__password')).toBe(true)
        })

        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormSecondSignature__password')).toBe(false)
        })
      })

      describe('passphrase field', () => {
        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormSecondSignature__passphrase')).toBe(true)
        })

        it('should not show if wallet does have a password', () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          expect(wrapper.contains('.TransactionFormSecondSignature__passphrase')).toBe(false)
        })
      })

      it('should have back button', () => {
        expect(wrapper.contains('.TransactionFormSecondSignature__back')).toBe(true)
      })

      describe('next button', () => {
        it('should be enabled if form is valid', async () => {
          wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
          wrapper.vm.$v.form.passphrase.$model = 'passphrase'
          wrapper.vm.isPassphraseVerified = true

          await wrapper.vm.$nextTick()

          expect(wrapper.find('.TransactionFormSecondSignature__step-2__next').attributes('disabled')).toBeFalsy()
        })

        it('should be disabled if form is invalid', async () => {
          wrapper.vm.$v.form.$touch()

          await wrapper.vm.$nextTick()

          expect(wrapper.find('.TransactionFormSecondSignature__step-2__next').attributes('disabled')).toBe('disabled')
        })
      })
    })
  })

  describe('computed', () => {
    describe('wordPositions', () => {
      it('should return required word permissions', () => {
        expect(wrapper.vm.wordPositions).toEqual([3, 6, 9])
      })
    })

    describe('passphraseWords', () => {
      it('should split passphrase by space', () => {
        wrapper.vm.secondPassphrase = 'this is a passphrase'

        expect(wrapper.vm.passphraseWords).toEqual([
          'this',
          'is',
          'a',
          'passphrase'
        ])
      })

      it('should split japanese passphrase by japanese space', () => {
        wrapper.vm.secondPassphrase = 'this\u3000is\u3000a\u3000passphrase'

        expect(wrapper.vm.passphraseWords).toEqual([
          'this',
          'is',
          'a',
          'passphrase'
        ])
      })
    })
  })

  describe('watch', () => {
    describe('isPassphraseStep', () => {
      it('should focus on passphrase verification if passphrase step', async () => {
        const spy = jest.spyOn(wrapper.vm.$refs.passphraseVerification, 'focusFirst')

        wrapper.vm.isPassphraseStep = true

        await wrapper.vm.$nextTick()

        expect(spy).toHaveBeenCalled()
      })

      it('should not focus on passphrase verification if not passphrase step', async () => {
        wrapper.vm.isPassphraseStep = true

        await wrapper.vm.$nextTick()

        const spy = jest.spyOn(wrapper.vm.$refs.passphraseVerification, 'focusFirst')
        wrapper.vm.isPassphraseStep = false

        await wrapper.vm.$nextTick()

        expect(spy).not.toHaveBeenCalled()
      })
    })
  })

  describe('created hook', () => {
    it('should generate second passphrase', () => {
      WalletService.generateSecondPassphrase.mockClear()

      createWrapper()

      expect(WalletService.generateSecondPassphrase).toHaveBeenNthCalledWith(1, 'EN')
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase and second passphrase', () => {
        createWrapper(null, {
          address: 'address-1',
          passphrase: null
        })

        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.secondPassphrase = 'second passphrase'

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
      it('should build second signature', async () => {
        const transactionData = {
          type: 5,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildSecondSignatureRegistration).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build second signature with default arguments', async () => {
        const transactionData = {
          type: 7,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildSecondSignatureRegistration).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.SECOND_SIGNATURE')
      })
    })

    describe('postSubmit', () => {
      it('should call reset method', () => {
        const spy = jest.spyOn(wrapper.vm, 'reset')

        wrapper.vm.postSubmit()

        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should set password verified to true', () => {
        wrapper.vm.isPassphraseVerified = false

        wrapper.vm.postSubmit()

        expect(wrapper.vm.isPassphraseVerified).toBe(true)
      })
    })

    describe('toggleStep', () => {
      it('should toggle passphrase step', () => {
        expect(wrapper.vm.isPassphraseStep).toBe(false)

        wrapper.vm.toggleStep()

        expect(wrapper.vm.isPassphraseStep).toBe(true)

        wrapper.vm.toggleStep()

        expect(wrapper.vm.isPassphraseStep).toBe(false)
      })
    })

    describe('displayPassphraseWords', () => {
      it('should toggle generating and show passphrase', (done) => {
        wrapper.vm.displayPassphraseWords()

        expect(wrapper.vm.isGenerating).toBe(true)

        setTimeout(() => {
          expect(wrapper.vm.isGenerating).toBe(false)
          expect(wrapper.vm.showPassphraseWords).toBe(true)

          done()
        }, 301)
      })
    })

    describe('generateNewPassphrase', () => {
      it('should call reset method', () => {
        const spy = jest.spyOn(wrapper.vm, 'reset')

        wrapper.vm.generateNewPassphrase()

        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should toggle generating and show passphrase', (done) => {
        WalletService.generateSecondPassphrase.mockClear()

        wrapper.vm.generateNewPassphrase()

        expect(wrapper.vm.isGenerating).toBe(true)

        setTimeout(() => {
          expect(wrapper.vm.isGenerating).toBe(false)
          expect(WalletService.generateSecondPassphrase).toHaveBeenNthCalledWith(1, 'EN')

          done()
        }, 301)
      })
    })

    describe('onVerification', () => {
      it('should set password verified', () => {
        wrapper.vm.isPassphraseVerified = false

        wrapper.vm.onVerification()

        expect(wrapper.vm.isPassphraseVerified).toBe(true)
      })
    })

    describe('reset', () => {
      it('should reset to delegate detail view', () => {
        wrapper.vm.isPassphraseStep = true

        expect(wrapper.vm.isPassphraseStep).toBe(true)

        wrapper.vm.reset()

        expect(wrapper.vm.isPassphraseStep).toBe(false)
      })

      it('should reset passphrase field if not encrypted or ledger', () => {
        const spy = jest.spyOn(wrapper.vm, '$set')
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        expect(wrapper.vm.$v.form.passphrase.$dirty).toBe(true)
        expect(wrapper.vm.form.passphrase).toBe('passphrase')

        wrapper.vm.reset()

        expect(wrapper.vm.$v.form.passphrase.$dirty).toBe(false)
        expect(wrapper.vm.form.passphrase).toBe('')
        expect(spy).toHaveBeenCalledWith(wrapper.vm.form, 'passphrase', '')
      })

      it('should reset password field if encrypted and not ledger', () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        const spy = jest.spyOn(wrapper.vm, '$set')
        wrapper.vm.$v.form.walletPassword.$model = 'password'

        expect(wrapper.vm.$v.form.walletPassword.$dirty).toBe(true)
        expect(wrapper.vm.form.walletPassword).toBe('password')

        wrapper.vm.reset()

        expect(wrapper.vm.$v.form.walletPassword.$dirty).toBe(false)
        expect(wrapper.vm.form.walletPassword).toBe('')
        expect(spy).toHaveBeenCalledWith(wrapper.vm.form, 'walletPassword', '')
      })

      it('should do nothing if ledger', () => {
        createWrapper(null, {
          isLedger: true
        })

        const spy = jest.spyOn(wrapper.vm, '$set')

        wrapper.vm.reset()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should do nothing if multi-signature wallet', () => {
        createWrapper(null, {
          multiSignature: true
        })

        const spy = jest.spyOn(wrapper.vm, '$set')

        wrapper.vm.reset()

        expect(spy).not.toHaveBeenCalled()
      })
    })
  })
})
