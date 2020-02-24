import { createLocalVue, mount } from '@vue/test-utils'
import nock from 'nock'
import installI18n from '../../../__utils__/i18n'
import { WalletTransactions } from '@/components/Wallet/WalletTransactions'
import WalletTransactionsMixin from '@/components/Wallet/WalletTransactions/mixin'
import * as mergeTableTransactions from '@/components/utils/merge-table-transactions'
import ClientService from '@/services/client'

const clientService = new ClientService(false)

const localVue = createLocalVue()
const i18n = installI18n(localVue)
const sampleTransactions = Object.freeze([])

let wrapper

let errorMock
let successMock
let eventOnMock
let eventOffMock
let clientFetchTransactionsMock
let loggerErrorMock
let dispatchMock
const createWrapper = (component, gettersTransactions) => {
  component = component || WalletTransactions
  gettersTransactions = gettersTransactions === undefined ? sampleTransactions : gettersTransactions

  errorMock = jest.fn()
  successMock = jest.fn()
  eventOnMock = jest.fn()
  eventOffMock = jest.fn()
  clientFetchTransactionsMock = jest.fn()
  loggerErrorMock = jest.fn()
  dispatchMock = jest.fn()

  wrapper = mount(component, {
    i18n,
    localVue,
    mocks: {
      $error: errorMock,
      $success: successMock,
      $client: {
        fetchWalletTransactions: clientFetchTransactionsMock
      },
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
          get 'transaction/byAddress' () {
            return gettersTransactions
          },
          'session/transactionTableRowCount': 10
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

describe('WalletTransactions', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletTransactions')).toBe(true)
  })

  describe('props transactionType', () => {
    beforeEach(() => {
      wrapper.setProps({
        transactionType: 7
      })
    })

    it('should be set', () => {
      expect(wrapper.vm.transactionType).toBe(7)
    })

    it('should be passed to TransactionTable component', () => {
      expect(wrapper.find('.TransactionTable').props('transactionType')).toBe(7)
    })
  })

  describe('created hook', () => {
    it('should load transactions', () => {
      const spy = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation()
      createWrapper()

      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should initiate event', () => {
      const spy = jest.spyOn(WalletTransactions.methods, 'enableNewTransactionEvent').mockImplementation()
      createWrapper()

      expect(eventOnMock).toHaveBeenCalledTimes(1)
      expect(eventOnMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions)

      spy.mockRestore()
    })

    it('should setup "new transaction" event', () => {
      const spy = jest.spyOn(WalletTransactions.methods, 'enableNewTransactionEvent').mockImplementation()
      createWrapper()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('address-1')

      spy.mockRestore()
    })
  })

  describe('beforeDestroy hook', () => {
    it('should disable event', () => {
      jest.spyOn(wrapper.vm, 'disableNewTransactionEvent').mockImplementation()

      eventOffMock.mockReset()
      wrapper.destroy()

      expect(eventOffMock).toHaveBeenCalledTimes(1)
      expect(eventOffMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadTransactions)
    })

    it('should disable "new transaction" event', () => {
      const spy = jest.spyOn(wrapper.vm, 'disableNewTransactionEvent').mockImplementation()

      wrapper.destroy()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('address-1')
    })

    it('should not disable "new transaction" event if no wallet from route', () => {
      const spy = jest.spyOn(wrapper.vm, 'disableNewTransactionEvent').mockImplementation()

      wrapper.vm.mockWalletRoute = null
      spy.mockReset()
      wrapper.destroy()

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('methods', () => {
    describe('enableNewTransactionEvent', () => {
      let spyDisableNew
      beforeEach(() => {
        spyDisableNew = jest.spyOn(wrapper.vm, 'disableNewTransactionEvent')
      })

      it('should not do anything if no address', () => {
        wrapper.vm.enableNewTransactionEvent(null)

        expect(spyDisableNew).not.toHaveBeenCalled()
      })

      it('should disable "new transaction" event if address value is given', () => {
        eventOnMock.mockReset()
        wrapper.vm.enableNewTransactionEvent('address')

        expect(spyDisableNew).toHaveBeenCalledTimes(1)
        expect(spyDisableNew).toHaveBeenCalledWith('address')
        expect(eventOnMock).toHaveBeenCalledTimes(1)
        expect(eventOnMock).toHaveBeenCalledWith('wallet:address:transaction:new', wrapper.vm.refreshStatusEvent)
      })
    })

    describe('disableNewTransactionEvent', () => {
      beforeEach(() => {
        eventOffMock.mockReset()
      })

      it('should not do anything if no address', () => {
        wrapper.vm.disableNewTransactionEvent(null)

        expect(eventOffMock).not.toHaveBeenCalled()
      })

      it('should disable "new transaction" event if address value is given', () => {
        wrapper.vm.enableNewTransactionEvent('address')

        expect(eventOffMock).toHaveBeenCalledTimes(1)
        expect(eventOffMock).toHaveBeenCalledWith('wallet:address:transaction:new', wrapper.vm.refreshStatusEvent)
      })
    })

    describe('getStoredTransactions', () => {
      const transactions = [
        { type: 10 },
        { type: 1 },
        { type: 7 },
        { type: 0 }
      ]

      it('should not do anything if no address', () => {
        const spy = jest.fn(() => [])
        createWrapper(null, spy)
        wrapper.vm.getStoredTransactions(null)

        expect(spy).not.toHaveBeenCalled()
      })

      it('should get stored transactions if address is provided', () => {
        const spy = jest.fn(() => [])
        createWrapper(null, spy)
        wrapper.vm.getStoredTransactions('address')

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith('address', { includeExpired: true })
      })

      it('should return all transactions if no transactionType prop is specified', () => {
        createWrapper(null, jest.fn(() => transactions))
        wrapper.setProps({
          transactionType: 0
        })

        expect(wrapper.vm.getStoredTransactions('address')).toEqual([{ type: 0 }])

        wrapper.setProps({
          transactionType: null
        })

        expect(wrapper.vm.getStoredTransactions('address')).toEqual(transactions)
      })

      it('should filter transactions if transactionType prop is specified', () => {
        createWrapper(null, jest.fn(() => transactions))
        wrapper.setProps({
          transactionType: 7
        })

        expect(wrapper.vm.getStoredTransactions('address')).toEqual([{ type: 7 }])
      })

      it('should return empty array if no results', () => {
        createWrapper(null, jest.fn(() => transactions))
        wrapper.setProps({
          transactionType: 2
        })

        expect(wrapper.vm.getStoredTransactions('address')).toEqual([])
      })
    })

    describe('getTransactions', () => {
      it('should not do anything if no address', async () => {
        const spy = jest.spyOn(wrapper.vm, 'queryParams', 'get')
        await wrapper.vm.getTransactions(null)

        expect(spy).not.toHaveBeenCalled()
      })

      it('should get stored transactions if address is provided', async () => {
        clientFetchTransactionsMock.mockReset()
        await wrapper.vm.getTransactions('address')

        expect(clientFetchTransactionsMock).toHaveBeenCalledTimes(1)
        expect(clientFetchTransactionsMock).toHaveBeenCalledWith('address', {
          transactionType: null,
          page: 1,
          limit: 10,
          orderBy: 'timestamp:desc'
        })
      })

      it('should use updated props when changed', async () => {
        const params = {
          page: 2,
          limit: 5,
          sort: {
            field: 'amount',
            type: 'asc'
          }
        }
        wrapper.setProps({
          transactionType: 7
        })
        wrapper.vm.__updateParams(params)

        clientFetchTransactionsMock.mockReset()
        await wrapper.vm.getTransactions('address')

        expect(clientFetchTransactionsMock).toHaveBeenCalledTimes(1)
        expect(clientFetchTransactionsMock).toHaveBeenCalledWith('address', {
          transactionType: 7,
          page: params.page,
          limit: params.limit,
          orderBy: `${params.sort.field}:${params.sort.type}`
        })
      })
    })

    describe('fetchTransactions', () => {
      const remoteTransactions = [
        'remote-1'
      ]
      const localTransactions = [
        'local-1'
      ]

      let mergeTableMock
      beforeEach(() => {
        mergeTableMock = jest.spyOn(mergeTableTransactions, 'default')
      })

      afterEach(() => {
        mergeTableMock.mockRestore()
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
        expect(spy).toHaveBeenCalledWith('address-1')
      })

      it('should delete transactions received from api', async () => {
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: remoteTransactions })

        await wrapper.vm.fetchTransactions()

        expect(dispatchMock).toHaveBeenCalledTimes(1)
        expect(dispatchMock).toHaveBeenCalledWith('transaction/deleteBulk', {
          transactions: remoteTransactions,
          profileId: 'profile-1'
        })
      })

      it('should attempt to merge stored and remote transaction arrays', async () => {
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: remoteTransactions })
        jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(localTransactions)

        await wrapper.vm.fetchTransactions()

        expect(mergeTableMock).toHaveBeenCalledTimes(1)
        expect(mergeTableMock).toHaveBeenCalledWith(remoteTransactions, localTransactions, wrapper.vm.queryParams.sort)
      })

      it('should store updated transactions if route address has not changed', async () => {
        mergeTableMock.mockReturnValue([...remoteTransactions, ...localTransactions])
        jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(localTransactions)
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({
          transactions: remoteTransactions,
          totalCount: 1
        })

        await wrapper.vm.fetchTransactions()

        expect(wrapper.vm.fetchedTransactions).toEqual([...remoteTransactions, ...localTransactions])
        expect(wrapper.vm.totalCount).toEqual(1)
      })

      it('should not store transactions if route address has changed', async () => {
        wrapper.vm.fetchedTransactions = ['placeholder']
        wrapper.vm.totalCount = 31

        await wrapper.vm.$nextTick()

        mergeTableMock.mockReturnValue([...remoteTransactions, ...localTransactions])
        jest.spyOn(wrapper.vm, 'reset').mockImplementation()
        jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(localTransactions)
        jest.spyOn(wrapper.vm, 'getTransactions').mockImplementation(async () => {
          wrapper.vm.mockWalletRoute = 2

          await wrapper.vm.$nextTick()

          return {
            transactions: remoteTransactions,
            totalCount: 1
          }
        })

        await wrapper.vm.fetchTransactions()

        expect(wrapper.vm.fetchedTransactions).toEqual(['placeholder'])
        expect(wrapper.vm.totalCount).toEqual(31)
      })

      it('should output error if not "wallet not found"', async () => {
        clientFetchTransactionsMock.mockImplementation((address, options = {}) => {
          return clientService.fetchWalletTransactions(address, options)
        })
        nock('http://localhost')
          .get('/wallets/address-1/transactions')
          .query(true)
          .reply(500, {
            message: 'oops'
          })

        wrapper.vm.fetchedTransactions = ['placeholder']

        loggerErrorMock.mockReset()
        errorMock.mockReset()
        await wrapper.vm.fetchTransactions()

        expect(loggerErrorMock).toHaveBeenCalled()
        expect(errorMock).toHaveBeenCalledWith('COMMON.FAILED_FETCH')
        expect(wrapper.vm.fetchedTransactions).toEqual([])
      })

      it('should not output error if "wallet not found"', async () => {
        clientFetchTransactionsMock.mockImplementation((address, options = {}) => {
          return clientService.fetchWalletTransactions(address, options)
        })
        nock('http://localhost')
          .get('/wallets/address-1/transactions')
          .query(true)
          .reply(404, {
            message: 'Wallet not found'
          })

        wrapper.vm.fetchedTransactions = ['placeholder']

        loggerErrorMock.mockReset()
        errorMock.mockReset()
        await wrapper.vm.fetchTransactions()

        expect(loggerErrorMock).not.toHaveBeenCalled()
        expect(errorMock).not.toHaveBeenCalled()
        expect(wrapper.vm.fetchedTransactions).toEqual([])
      })
    })

    describe('refreshStatusEvent', () => {
      it('should call refreshStatus', () => {
        const spy = jest.spyOn(WalletTransactions.methods, 'refreshStatus').mockImplementation()
        createWrapper()

        wrapper.vm.refreshStatusEvent()
        expect(spy).toHaveBeenCalledTimes(1)

        spy.mockRestore()
      })
    })

    describe('refreshStatus', () => {
      it('should do nothing if no wallet', async () => {
        const spy = jest.spyOn(wrapper.vm, 'getTransactions')

        wrapper.vm.mockWalletRoute = null
        await wrapper.vm.refreshStatus()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should update transaction notice if new transactions', async () => {
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: [{ id: 'test' }] })
        jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue([])

        await wrapper.vm.refreshStatus()

        expect(wrapper.vm.newTransactionsNotice).toBe('WALLET_TRANSACTIONS.NEW_TRANSACTIONS')
      })

      it('should not update transaction notice if no new transactions', async () => {
        const transactions = [{ id: 'test' }]
        wrapper.vm.fetchedTransactions = transactions
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions })
        jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue(transactions)

        await wrapper.vm.refreshStatus()

        expect(wrapper.vm.newTransactionsNotice).not.toBe('WALLET_TRANSACTIONS.NEW_TRANSACTIONS')
      })

      it('should update transaction confirmations', async () => {
        const newTransactions = [{ id: 'test', confirmations: 2 }]
        const oldTransactions = [{ id: 'test', confirmations: 1 }]
        jest.spyOn(wrapper.vm, 'getTransactions').mockReturnValue({ transactions: newTransactions })
        jest.spyOn(wrapper.vm, 'getStoredTransactions').mockReturnValue([])
        wrapper.vm.fetchedTransactions = oldTransactions

        await wrapper.vm.refreshStatus()

        expect(oldTransactions[0].confirmations).toBe(2)
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

    describe('onPageChange', () => {
      it('should do nothing if currentPage has not changed', () => {
        const spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation()
        const spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation()
        createWrapper()

        wrapper.vm.onPageChange({ currentPage: 1 })
        expect(spyParams).not.toHaveBeenCalled()
        expect(spyTransactions).toHaveBeenCalledTimes(1) // gets called once in the created lifecycle hook

        spyParams.mockRestore()
        spyTransactions.mockRestore()
      })

      it('should update params and load transactions if currentPage has changed', () => {
        const spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation()
        const spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation()
        createWrapper()

        wrapper.vm.onPageChange({ currentPage: 10 })
        expect(wrapper.vm.currentPage).toBe(10)
        expect(spyParams).toHaveBeenCalledTimes(1)
        expect(spyTransactions).toHaveBeenCalledTimes(2) // gets called once in the created lifecycle hook

        spyParams.mockRestore()
        spyTransactions.mockRestore()
      })
    })

    describe('onPerPageChange', () => {
      it('should do nothing if currentPerPage has not changed', () => {
        const spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation()
        const spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation()
        createWrapper()

        wrapper.vm.onPerPageChange({ currentPerPage: 10 })
        expect(spyParams).not.toHaveBeenCalled()
        expect(spyTransactions).toHaveBeenCalledTimes(1) // gets called once in the created lifecycle hook

        spyParams.mockRestore()
        spyTransactions.mockRestore()
      })

      it('should update params and load transactions if currentPerPage has changed', () => {
        const spyParams = jest.spyOn(WalletTransactionsMixin.methods, '__updateParams').mockImplementation()
        const spyTransactions = jest.spyOn(WalletTransactionsMixin.methods, 'loadTransactions').mockImplementation()
        createWrapper()

        wrapper.vm.currentPage = 5

        wrapper.vm.onPerPageChange({ currentPerPage: 20 })
        expect(spyParams).toHaveBeenCalledTimes(1)
        expect(spyTransactions).toHaveBeenCalledTimes(2) // gets called once in the created lifecycle hook
        expect(wrapper.vm.currentPage).toBe(1)
        spyParams.mockRestore()
        spyTransactions.mockRestore()
      })
    })
  })
})
