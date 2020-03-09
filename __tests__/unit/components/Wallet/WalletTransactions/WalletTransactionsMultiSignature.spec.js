import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import { WalletTransactionsMultiSignature } from '@/components/Wallet/WalletTransactions'
import WalletTransactionsMixin from '@/components/Wallet/WalletTransactions/mixin'
import MultiSignatureClient from '@/services/client-multisig'
import WalletService from '@/services/wallet'

jest.mock('@/services/wallet')

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper

let errorMock
let successMock
let eventOnMock
let eventOffMock
let multiSignatureClientMock
let publicKeyFromWalletMock
let loggerErrorMock
let dispatchMock
const createWrapper = (component) => {
  component = component || WalletTransactionsMultiSignature

  errorMock = jest.fn()
  successMock = jest.fn()
  eventOnMock = jest.fn()
  eventOffMock = jest.fn()
  multiSignatureClientMock = jest.spyOn(MultiSignatureClient, 'getTransactions').mockImplementation()
  loggerErrorMock = jest.fn()
  dispatchMock = jest.fn()
  publicKeyFromWalletMock = jest.fn() // jest.spyOn(WalletService.default, 'getPublicKeyFromWallet').mockImplementation()
  WalletService.getPublicKeyFromWallet = publicKeyFromWalletMock.bind(WalletService)

  wrapper = mount(component, {
    i18n,
    localVue,
    mocks: {
      $error: errorMock,
      $success: successMock,
      $eventBus: {
        on: eventOnMock,
        off: eventOffMock
      },
      $logger: {
        error: loggerErrorMock
      },
      $store: {
        dispatch: dispatchMock,
        getters: {
          get 'session/multiSignaturePeer' () {
            return {
              ip: 'http://1.2.3.4',
              port: 1234
            }
          }
          // get 'transaction/byAddress' () {
          //   return gettersTransactions
          // }
        }
      },
      session_profile: {
        id: 'profile-1'
      }
    },
    mixins: [{
      data: () => ({
        mockWalletRoute: 1
      }),
      computed: {
        wallet_fromRoute () {
          return !this.mockWalletRoute ? null : {
            address: `address-${this.mockWalletRoute}`,
            business: {
              name: 'business-name',
              website: 'http://business.website',
              publicKey: `public-key-${this.mockWalletRoute}`,
              resigned: false
            },
            publicKey: `public-key-${this.mockWalletRoute}`
          }
        }
      }
    }],
    stubs: {
      TransactionTable: '<div class="TransactionTable"></div>'
    }
  })
}

describe('WalletTransactionsMultiSignature', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletTransactions')).toBe(true)
  })

  describe('created hook', () => {
    it('should load transactions', () => {
      const spy = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation()
      createWrapper()

      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should initiate event', () => {
      const spy = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation()
      createWrapper()

      expect(eventOnMock).toHaveBeenCalledTimes(2)
      expect(eventOnMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions)
      expect(eventOnMock).toHaveBeenCalledWith('wallet:reload:multi-signature', wrapper.vm.loadTransactions)

      spy.mockRestore()
    })
  })

  describe('beforeDestroy hook', () => {
    it('should disable event', () => {
      eventOffMock.mockReset()
      wrapper.destroy()

      expect(eventOffMock).toHaveBeenCalledTimes(2)
      expect(eventOffMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions)
      expect(eventOffMock).toHaveBeenCalledWith('wallet:reload:multi-signature', wrapper.vm.loadTransactions)
    })
  })

  describe('methods', () => {
    describe('getTransactions', () => {
      it('should not do anything if no address', async () => {
        const spy = jest.spyOn(wrapper.vm, 'queryParams', 'get')
        await wrapper.vm.getTransactions(null)

        expect(spy).not.toHaveBeenCalled()
      })

      it('should get transactions from peer', async () => {
        multiSignatureClientMock.mockReset()
        await wrapper.vm.getTransactions('publicKey')

        expect(multiSignatureClientMock).toHaveBeenCalledTimes(1)
        expect(multiSignatureClientMock).toHaveBeenCalledWith({
          ip: 'http://1.2.3.4',
          port: 1234
        }, 'publicKey')
      })
    })

    describe('fetchTransactions', () => {
      const remoteTransactions = [
        'remote-1'
      ]

      beforeEach(() => {
        publicKeyFromWalletMock.mockReset()
        publicKeyFromWalletMock.mockReturnValue('publicKey')
      })

      it('should not fetch if already fetching', async () => {
        const spy = jest.spyOn(wrapper.vm, 'getTransactions')

        wrapper.vm.isFetching = true
        await wrapper.vm.fetchTransactions()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should fetch if not already fetching', async () => {
        const spy = jest.spyOn(wrapper.vm, 'getTransactions')

        await wrapper.vm.fetchTransactions()

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith('publicKey')
      })

      it('should not fetch if no wallet', async () => {
        wrapper.vm.mockWalletRoute = null

        await wrapper.vm.$nextTick()
        await wrapper.vm.fetchTransactions()

        expect(publicKeyFromWalletMock).not.toHaveBeenCalled()
      })

      it('should store updated transactions if route address has not changed', async () => {
        wrapper.vm.fetchedTransactions = ['placeholder']
        wrapper.vm.totalCount = 31

        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({
          transactions: remoteTransactions,
          totalCount: 1
        })

        await wrapper.vm.fetchTransactions()

        expect(wrapper.vm.fetchedTransactions).toEqual(remoteTransactions)
        expect(wrapper.vm.totalCount).toEqual(1)
      })

      it('should not store transactions if route address has changed', async () => {
        wrapper.vm.fetchedTransactions = ['placeholder']
        wrapper.vm.totalCount = 31

        await wrapper.vm.$nextTick()
        jest.spyOn(wrapper.vm, 'getTransactions').mockImplementation(async () => {
          publicKeyFromWalletMock.mockReturnValue('differentPublicKey')

          return {
            transactions: remoteTransactions,
            totalCount: 1
          }
        })

        await wrapper.vm.fetchTransactions()

        expect(wrapper.vm.fetchedTransactions).toEqual(['placeholder'])
        expect(wrapper.vm.totalCount).toEqual(31)
      })
    })

    describe('refreshStatus', () => {
      beforeEach(() => {
        publicKeyFromWalletMock.mockReset()
        publicKeyFromWalletMock.mockReturnValue('publicKey')
      })

      it('should do nothing if no wallet', async () => {
        const spy = jest.spyOn(wrapper.vm, 'getTransactions')

        wrapper.vm.mockWalletRoute = null
        await wrapper.vm.refreshStatus()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should update transaction notice if new transactions', async () => {
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: [{ id: 'test' }] })

        await wrapper.vm.refreshStatus()

        expect(wrapper.vm.newTransactionsNotice).toBe('WALLET_TRANSACTIONS.NEW_TRANSACTIONS')
      })

      it('should not update transaction notice if no new transactions', async () => {
        const transactions = [{ id: 'test' }]
        wrapper.vm.fetchedTransactions = transactions
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions })

        await wrapper.vm.refreshStatus()

        expect(wrapper.vm.newTransactionsNotice).not.toBe('WALLET_TRANSACTIONS.NEW_TRANSACTIONS')
      })

      it('should do nothing if no publicKey', async () => {
        const spy = jest.spyOn(wrapper.vm, 'getTransactions')

        publicKeyFromWalletMock.mockReturnValue(null)
        await wrapper.vm.refreshStatus()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should do nothing on error', async () => {
        wrapper.vm.newTransactionsNotice = 'test'
        const error = new Error('failed web request')
        jest.spyOn(wrapper.vm, 'getTransactions').mockImplementation(() => {
          throw error
        })

        await wrapper.vm.refreshStatus()

        expect(loggerErrorMock).toHaveBeenCalledWith('Failed to update confirmations: ', error)
        expect(wrapper.vm.newTransactionsNotice).toBe('test')
      })
    })
  })
})
