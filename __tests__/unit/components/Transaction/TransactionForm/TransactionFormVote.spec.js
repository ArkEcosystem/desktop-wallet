import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../__utils__/i18n'
import { TransactionFormVote } from '@/components/Transaction/TransactionForm'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'
import BigNumber from '@/plugins/bignumber'

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
  knownWallets: {},
  constants: {
    activeDelegates: 51
  }
}

let wrapper
const createWrapper = (component, wallet, delegate) => {
  component = component || TransactionFormVote
  wallet = wallet || {
    address: 'address-1'
  }
  delegate = delegate || {
    username: 'delegate-1',
    publicKey: 'public-key-1',
    address: 'delegate-address-1',
    blocks: {
      produced: 10
    },
    production: {
      approval: 1.0
    },
    forged: {
      total: (10 * 1e8).toString()
    },
    voters: 10
  }

  if (!Object.keys(wallet).includes('passphrase')) {
    wallet.passphrase = null
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    propsData: {
      delegate
    },
    mocks: {
      $client: {
        buildVote: jest.fn((transactionData) => transactionData),
        fetchDelegateForged: jest.fn((delegate) => delegate.forged.total),
        fetchDelegateVoters: jest.fn((delegate) => delegate.voters)
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

describe('TransactionFormVote', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have vote transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(3)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormVote')).toBe(true)
    })

    it('should have delegate details', () => {
      expect(wrapper.vm.isPassphraseStep).toBe(false)
      expect(wrapper.find('.TransactionFormVote__delegate-details').props('isOpen')).toBe(true)
    })

    describe('passphrase step', () => {
      beforeEach(() => {
        wrapper.vm.isPassphraseStep = true
      })

      it('should hide delegate details when choosing to vote', () => {
        expect(wrapper.find('.TransactionFormVote__delegate-details').props('isOpen')).toBe(false)
      })

      it('should have fee field', () => {
        expect(wrapper.contains('.TransactionFormVote__fee')).toBe(true)
      })

      it('should have hash field', () => {
        expect(wrapper.contains('.TransactionFormVote__fee')).toBe(true)
      })

      describe('ledger notice', () => {
        it('should show if wallet is a ledger', () => {
          createWrapper(null, {
            isLedger: true
          })

          expect(wrapper.contains('.TransactionFormVote__ledger-notice')).toBe(true)
        })

        it('should show if wallet is not a ledger', () => {
          createWrapper(null, {
            isLedger: false
          })

          expect(wrapper.contains('.TransactionFormVote__ledger-notice')).toBe(false)
        })
      })

      describe('password field', () => {
        it('should show if wallet does have a password', () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          expect(wrapper.contains('.TransactionFormVote__password')).toBe(true)
        })

        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormVote__password')).toBe(false)
        })
      })

      describe('passphrase field', () => {
        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormVote__passphrase')).toBe(true)
        })

        it('should not show if wallet does have a password', () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          expect(wrapper.contains('.TransactionFormVote__passphrase')).toBe(false)
        })
      })

      describe('next button', () => {
        it('should be enabled if form is valid', async () => {
          wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
          wrapper.vm.$v.form.passphrase.$model = 'passphrase'

          await wrapper.vm.$nextTick()

          expect(wrapper.find('.TransactionFormVote__next').attributes('disabled')).toBeFalsy()
        })

        it('should be disabled if form is invalid', async () => {
          wrapper.vm.$v.form.$touch()

          await wrapper.vm.$nextTick()

          expect(wrapper.find('.TransactionFormVote__next').attributes('disabled')).toBe('disabled')
        })
      })
    })
  })

  describe('computed', () => {
    describe('blocksProduced', () => {
      it('should return blocks produced for delegate', () => {
        expect(wrapper.vm.blocksProduced).toBe(10)
      })

      it('should return 0 if no delegate', () => {
        wrapper.setProps({
          delegate: {
            blocks: null
          }
        })

        expect(wrapper.vm.blocksProduced).toBe(0)

        wrapper.setProps({
          delegate: {
            blocks: {
              produced: null
            },
            production: {
              approval: 1.0
            }
          }
        })

        expect(wrapper.vm.blocksProduced).toBe(0)
      })
    })

    describe('showVoteUnvoteButton', () => {
      it('should return false if wallet is a contact', () => {
        createWrapper(null, {
          isContact: true
        })

        expect(wrapper.vm.showVoteUnvoteButton).toBe(false)
      })

      it('should return false if wallet is voting but not for delegate', () => {
        wrapper.setProps({
          isVoter: false,
          votedDelegate: {
            username: 'delegate-2',
            publicKey: 'public-key-2',
            address: 'delegate-address-2',
            blocks: {
              produced: 10
            },
            production: {
              approval: 1.0
            },
            forged: {
              total: '0'
            },
            voters: 10
          }
        })

        expect(wrapper.vm.showVoteUnvoteButton).toBe(false)
      })

      it('should return true if not voting', () => {
        wrapper.setProps({
          votedDelegate: null
        })

        expect(wrapper.vm.showVoteUnvoteButton).toBe(true)
      })

      it('should return true if voting for this delegate', () => {
        wrapper.setProps({
          isVoter: true,
          votedDelegate: {
            username: 'delegate-1',
            publicKey: 'public-key-1',
            address: 'delegate-address-1',
            blocks: {
              produced: 10
            },
            production: {
              approval: 1.0
            },
            forged: {
              total: '0'
            },
            voters: 10
          }
        })

        expect(wrapper.vm.showVoteUnvoteButton).toBe(true)
      })
    })

    describe('showCurrentlyVoting', () => {
      it('should return true if voting for a different delegate', () => {
        wrapper.setProps({
          isVoter: false,
          votedDelegate: {
            username: 'delegate-2',
            publicKey: 'public-key-2',
            address: 'delegate-address-2',
            blocks: {
              produced: 10
            },
            production: {
              approval: 1.0
            },
            forged: {
              total: '0'
            },
            voters: 10
          }
        })

        expect(wrapper.vm.showCurrentlyVoting).toBe(true)
      })
    })
  })

  describe('watch', () => {
    describe('isPassphraseStep', () => {
      it('should do nothing if ledger wallet', async () => {
        createWrapper(null, {
          isLedger: true,
          get passphrase () {
            return null
          }
        })

        const spy = jest.spyOn(wrapper.vm.currentWallet, 'passphrase', 'get')

        wrapper.vm.isPassphraseStep = true

        await wrapper.vm.$nextTick()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should do nothing if multi-signature', async () => {
        createWrapper(null, {
          multiSignature: true,
          get passphrase () {
            return null
          }
        })

        const spy = jest.spyOn(wrapper.vm.currentWallet, 'passphrase', 'get')

        wrapper.vm.isPassphraseStep = true

        await wrapper.vm.$nextTick()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should focus on password field', async () => {
        createWrapper(null, {
          passphrase: 'password'
        })

        const spy = jest.spyOn(wrapper.vm.$refs.password, 'focus')

        wrapper.vm.isPassphraseStep = true

        await wrapper.vm.$nextTick()

        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should focus on passphrase field', async () => {
        const spy = jest.spyOn(wrapper.vm.$refs.passphrase, 'focus')

        wrapper.vm.isPassphraseStep = true

        await wrapper.vm.$nextTick()

        expect(spy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('mounted hook', () => {
    it('should fetch delegate data', () => {
      const fetchForgedOriginal = TransactionFormVote.methods.fetchForged
      const fetchVotersOriginal = TransactionFormVote.methods.fetchVoters
      TransactionFormVote.methods.fetchForged = jest.fn()
      TransactionFormVote.methods.fetchVoters = jest.fn()

      createWrapper()

      expect(TransactionFormVote.methods.fetchForged).toHaveBeenCalledTimes(1)
      expect(TransactionFormVote.methods.fetchVoters).toHaveBeenCalledTimes(1)

      TransactionFormVote.methods.fetchForged = fetchForgedOriginal
      TransactionFormVote.methods.fetchVoters = fetchVotersOriginal
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
          votes: [
            '+public-key-1'
          ],
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })

      it('should return correct data when unvoting with passphrase', () => {
        wrapper.setProps({
          isVoter: true
        })

        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          passphrase: 'passphrase',
          votes: [
            '-public-key-1'
          ],
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
          votes: [
            '+public-key-1'
          ],
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build vote', async () => {
        const transactionData = {
          type: 5,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildVote).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build vote with default arguments', async () => {
        const transactionData = {
          type: 7,
          typeGroup: 1
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildVote).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.VOTE')
      })
    })

    describe('postSubmit', () => {
      it('should call reset method', () => {
        const spy = jest.spyOn(wrapper.vm, 'reset')

        wrapper.vm.postSubmit()

        expect(spy).toHaveBeenCalledTimes(1)
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

    describe('fetchForged', () => {
      it('should update forged value', () => {
        wrapper.vm.fetchForged()

        expect(wrapper.vm.forged).toEqual('ARK 10.00')
      })
    })

    describe('fetchVoters', () => {
      it('should update voters value', async () => {
        await wrapper.vm.fetchVoters()

        expect(wrapper.vm.voters).toEqual(10)
      })

      it('should update voters value to default if no response', async () => {
        jest.spyOn(wrapper.vm.$client, 'fetchDelegateVoters').mockReturnValue(null)
        await wrapper.vm.fetchVoters()

        expect(wrapper.vm.voters).toEqual('0')
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

    describe('emitCancel', () => {
      it('should emit cancel', () => {
        wrapper.vm.emitCancel()

        expect(wrapper.emitted('cancel')).toEqual([['navigateToTransactions']])
      })
    })
  })
})
