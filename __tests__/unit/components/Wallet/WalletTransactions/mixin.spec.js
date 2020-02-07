import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import { WalletTransactions, WalletTransactionsMultiSignature } from '@/components/Wallet/WalletTransactions'

// Do not mock WalletService
jest.mock('@/services/wallet', () => jest.requireActual('@/services/wallet'))

const localVue = createLocalVue()
const i18n = installI18n(localVue)
const sampleTransactions = Object.freeze([])

let wrapper
let errorMock
let successMock
let loggerErrorMock
let dispatchMock
const createWrapper = (component, gettersTransactions, gettersTableRowCount) => {
  component = component || WalletTransactions
  gettersTransactions = gettersTransactions === undefined ? sampleTransactions : gettersTransactions
  gettersTableRowCount = gettersTableRowCount === undefined ? 10 : gettersTableRowCount

  errorMock = jest.fn()
  successMock = jest.fn()
  loggerErrorMock = jest.fn()
  dispatchMock = jest.fn()

  wrapper = mount(component, {
    i18n,
    localVue,
    mocks: {
      $error: errorMock,
      $success: successMock,
      $logger: {
        error: loggerErrorMock
      },
      $store: {
        dispatch: dispatchMock,
        getters: {
          get 'transaction/byAddress' () {
            return gettersTransactions
          },
          get 'session/transactionTableRowCount' () {
            return gettersTableRowCount
          }
        }
      },
      session_profile: {
        id: 'profile-1'
      }
    },
    mixins: [{
      data: () => ({
        mockWalletRoute: 1,
        mockWalletRouteBusinessName: 'business-name'
      }),
      computed: {
        wallet_fromRoute () {
          return !this.mockWalletRoute ? null : {
            address: `address-${this.mockWalletRoute}`,
            business: {
              name: this.mockWalletRouteBusinessName,
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

describe.each([
  ['WalletTransactions', WalletTransactions],
  ['WalletTransactionsMultiSignature', WalletTransactionsMultiSignature]
])('%s', (componentName, component) => {
  beforeEach(() => {
    createWrapper(component)
  })

  describe('template', () => {
    describe('TransactionTable', () => {
      it('should render', () => {
        expect(wrapper.contains('.TransactionTable')).toBe(true)
      })

      it('should pass correct props', async () => {
        wrapper.vm.isLoading = false

        const props = wrapper.find('.TransactionTable').vm.$attrs

        await wrapper.vm.$nextTick()

        const expectedProps = {
          'current-page': 1,
          rows: [],
          'total-rows': 0,
          'is-loading': false,
          'is-remote': true,
          'has-pagination': false,
          'sort-query': {
            field: 'timestamp',
            type: 'desc'
          },
          'per-page': 10
        }

        if (componentName === 'WalletTransactionsMultiSignature') {
          expectedProps['is-remote'] = false
        }

        expect(props).toEqual(expectedProps)

        if (componentName === 'WalletTransactions') {
          expect(props['transaction-type']).toBe(undefined)
        }
      })

      it('should pass updated props', async () => {
        createWrapper(component, undefined, 20)
        wrapper.setProps({
          transactionType: 7
        })

        wrapper.vm.currentPage = 3
        wrapper.vm.fetchedTransactions = ['test']
        wrapper.vm.totalCount = 12
        wrapper.vm.isLoading = true
        wrapper.vm.queryParams.sort = {
          field: 'amount',
          type: 'asc'
        }

        const props = wrapper.find('.TransactionTable').vm.$attrs

        await wrapper.vm.$nextTick()

        const expectedProps = {
          'current-page': 3,
          rows: ['test'],
          'total-rows': 12,
          'is-loading': true,
          'is-remote': true,
          'has-pagination': true,
          'sort-query': {
            field: 'amount',
            type: 'asc'
          },
          'per-page': 20
        }

        if (componentName === 'WalletTransactionsMultiSignature') {
          expectedProps['is-remote'] = false
          expectedProps['has-pagination'] = false
        }

        expect(props).toEqual(expectedProps)

        if (componentName === 'WalletTransactions') {
          expect(wrapper.find('.TransactionTable').props('transactionType')).toBe(7)
        }
      })
    })
  })

  describe('newTransactionsNotice', () => {
    it('should not show notice bar if not set', () => {
      wrapper.vm.newTransactionsNotice = 'TEST NOTICE'

      expect(wrapper.contains('.WalletTransactions__notice')).toBe(true)

      wrapper.vm.newTransactionsNotice = null

      expect(wrapper.contains('.WalletTransactions__notice')).toBe(false)
    })

    it('should output new transactions notice when set', () => {
      expect(wrapper.contains('.WalletTransactions__notice')).toBe(false)

      wrapper.vm.newTransactionsNotice = 'TEST NOTICE'

      expect(wrapper.contains('.WalletTransactions__notice')).toBe(true)
      expect(wrapper.find('.WalletTransactions__notice').text()).toBe('TEST NOTICE')
    })
  })

  describe('watch wallet_fromRoute', () => {
    it('should reset when wallet route changes', async () => {
      const spyLoadTransactions = jest.spyOn(wrapper.vm, 'loadTransactions').mockImplementation(jest.fn())
      const spyReset = jest.spyOn(wrapper.vm, 'reset').mockImplementation()

      wrapper.setData({
        mockWalletRoute: 2
      })

      expect(wrapper.vm.wallet_fromRoute.address).toEqual('address-2')

      expect(spyLoadTransactions).toHaveBeenCalledTimes(1)
      expect(spyReset).toHaveBeenCalledTimes(1)
    })
  })

  describe('computed', () => {
    describe('sortQuery', () => {
      it('should get data from queryParams', () => {
        expect(wrapper.vm.sortQuery).toEqual({
          field: wrapper.vm.queryParams.sort.field,
          type: wrapper.vm.queryParams.sort.type
        })

        wrapper.vm.queryParams.sort.field = 'test'
        wrapper.vm.queryParams.sort.type = 'test'

        expect(wrapper.vm.sortQuery).toEqual({
          field: wrapper.vm.queryParams.sort.field,
          type: wrapper.vm.queryParams.sort.type
        })
      })
    })

    describe('transactionTableRowCount', () => {
      it('should get data from session', () => {
        createWrapper(null, undefined, 50)

        expect(wrapper.vm.transactionTableRowCount).toBe(50)

        createWrapper(null, undefined, 20)

        expect(wrapper.vm.transactionTableRowCount).toBe(20)
      })

      it('should get data from session', () => {
        expect(wrapper.vm.transactionTableRowCount).toBe(10)

        wrapper.vm.transactionTableRowCount = 50

        expect(dispatchMock).toHaveBeenCalledWith('session/setTransactionTableRowCount', 50)
        expect(dispatchMock).toHaveBeenCalledWith('profile/update', {
          id: 'profile-1',
          transactionTableRowCount: 50
        })
      })
    })
  })

  describe('watch', () => {
    describe('wallet_fromRoute', () => {
      it('should reset when wallet changes', async () => {
        const spy = jest.spyOn(wrapper.vm, 'reset')

        spy.mockReset()
        wrapper.vm.mockWalletRoute++

        await wrapper.vm.$nextTick()

        expect(spy).toHaveBeenCalledTimes(1)
      })

      it('should refresh status if wallet has not changed', async () => {
        const spy = jest.spyOn(wrapper.vm, 'refreshStatus')

        spy.mockReset()
        wrapper.vm.mockWalletRouteBusinessName = 'new business'

        await wrapper.vm.$nextTick()

        expect(spy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('methods', () => {
    describe('loadTransactions', () => {
      it('should not run if no wallet', async () => {
        const spy = jest.spyOn(wrapper.vm, 'fetchTransactions')

        wrapper.vm.mockWalletRoute = 0
        await wrapper.vm.loadTransactions()
        await wrapper.vm.$nextTick()

        expect(spy).not.toHaveBeenCalled()
      })

      it('should not run if already fetching', async () => {
        const spy = jest.spyOn(wrapper.vm, 'fetchTransactions')

        wrapper.vm.isFetching = true
        await wrapper.vm.loadTransactions()

        expect(spy).toHaveBeenCalledTimes(0)
      })

      it('should run if wallet and not already fetching', async () => {
        const spy = jest.spyOn(wrapper.vm, 'fetchTransactions')

        await wrapper.vm.loadTransactions()

        expect(wrapper.vm.isFetching).toBe(false)
        expect(wrapper.vm.wallet_fromRoute).toBeTruthy()
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    if (componentName === 'WalletTransactions') {
      describe('onPageChange', () => {
        it('should update page data', () => {
          const updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams')
          const loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions')

          expect(wrapper.vm.currentPage).toBe(1)

          wrapper.vm.onPageChange({ currentPage: 10 })

          expect(wrapper.vm.currentPage).toBe(10)
          expect(wrapper.vm.queryParams.page).toBe(10)
          expect(updateParamsSpy).toHaveBeenCalledTimes(1)
          expect(updateParamsSpy).toHaveBeenCalledWith({ page: 10 })
          expect(loadTransactionsSpy).toHaveBeenCalledTimes(1)
        })

        it('should do nothing if invalid page', () => {
          const updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams')
          const loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions')

          expect(wrapper.vm.currentPage).toBe(1)

          wrapper.vm.onPageChange({ currentPage: null })

          expect(wrapper.vm.currentPage).toBe(1)
          expect(wrapper.vm.queryParams.page).toBe(1)
          expect(updateParamsSpy).not.toHaveBeenCalled()
          expect(loadTransactionsSpy).not.toHaveBeenCalled()
        })
      })

      describe('onPerPageChange', () => {
        it('should update page data', () => {
          const updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams')
          const loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions')

          wrapper.vm.queryParams.page = 11
          expect(wrapper.vm.queryParams.limit).toBe(10)

          wrapper.vm.onPerPageChange({ currentPerPage: 20 })

          expect(wrapper.vm.queryParams.limit).toBe(20)
          expect(wrapper.vm.queryParams.page).toBe(1)
          expect(updateParamsSpy).toHaveBeenCalledTimes(1)
          expect(updateParamsSpy).toHaveBeenCalledWith({ limit: 20, page: 1 })
          expect(loadTransactionsSpy).toHaveBeenCalledTimes(1)
          expect(dispatchMock).toHaveBeenCalledWith('session/setTransactionTableRowCount', 20)
        })

        it('should do nothing if invalid page', () => {
          const updateParamsSpy = jest.spyOn(wrapper.vm, '__updateParams')
          const loadTransactionsSpy = jest.spyOn(wrapper.vm, 'loadTransactions')

          wrapper.vm.queryParams.page = 11
          expect(wrapper.vm.queryParams.limit).toBe(10)

          wrapper.vm.onPerPageChange({ currentPerPage: null })

          expect(wrapper.vm.queryParams.limit).toBe(10)
          expect(wrapper.vm.queryParams.page).toBe(11)
          expect(updateParamsSpy).not.toHaveBeenCalled()
          expect(loadTransactionsSpy).not.toHaveBeenCalled()
          expect(dispatchMock).not.toHaveBeenCalledWith('session/setTransactionTableRowCount', 20)
        })
      })
    }

    describe('onSortChange', () => {
      let spyUpdateParams, spyLoadTransactions

      beforeEach(() => {
        spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams')
        spyLoadTransactions = jest.spyOn(wrapper.vm, 'loadTransactions')
      })

      it('should update sort column', () => {
        wrapper.vm.onSortChange({
          source: 'transactionsTab',
          field: 'amount',
          type: 'desc'
        })

        expect(spyUpdateParams).toHaveBeenCalledTimes(1)

        const expectedUpdateParams = {
          sort: {
            field: 'amount',
            type: 'desc'
          }
        }

        if (componentName === 'WalletTransactions') {
          expectedUpdateParams.page = 1
          expect(spyLoadTransactions).toHaveBeenCalledTimes(1)
        }

        expect(spyUpdateParams).toHaveBeenCalledWith(expectedUpdateParams)
      })

      it('should update sort column direction', () => {
        wrapper.vm.onSortChange({
          source: 'transactionsTab',
          field: 'timestamp',
          type: 'asc'
        })

        expect(spyUpdateParams).toHaveBeenCalledTimes(1)

        const expectedUpdateParams = {
          sort: {
            field: 'timestamp',
            type: 'asc'
          }
        }

        if (componentName === 'WalletTransactions') {
          expectedUpdateParams.page = 1
          expect(spyLoadTransactions).toHaveBeenCalledTimes(1)
        }

        expect(spyUpdateParams).toHaveBeenCalledWith(expectedUpdateParams)
      })

      it('should not do anything if source is falsy', () => {
        wrapper.vm.onSortChange({
          source: null,
          field: 'amount',
          type: 'desc'
        })

        expect(spyUpdateParams).toHaveBeenCalledTimes(0)
        expect(spyLoadTransactions).toHaveBeenCalledTimes(0)
      })

      it('should not do anything if source is not transactionsTab', () => {
        wrapper.vm.onSortChange({
          source: 'notTransactionsTab',
          field: 'amount',
          type: 'desc'
        })

        expect(spyUpdateParams).toHaveBeenCalledTimes(0)
        expect(spyLoadTransactions).toHaveBeenCalledTimes(0)
      })

      it('should not do anything if column and direction do not change', () => {
        wrapper.vm.onSortChange({
          source: 'transactionsTab',
          field: 'timestamp',
          type: 'desc'
        })

        expect(spyUpdateParams).toHaveBeenCalledTimes(0)
        expect(spyLoadTransactions).toHaveBeenCalledTimes(0)
      })
    })

    describe('reset', () => {
      if (componentName === 'WalletTransactions') {
        it('should reset values', () => {
          wrapper.vm.currentPage = 10
          wrapper.vm.queryParams.page = 10
          wrapper.vm.totalCount = 10
          wrapper.vm.fetchedTransactions = [
            'fake entry'
          ]

          wrapper.vm.reset()

          expect(wrapper.vm.currentPage).toBe(1)
          expect(wrapper.vm.queryParams.page).toBe(1)
          expect(wrapper.vm.totalCount).toBe(0)
          expect(wrapper.vm.fetchedTransactions).toEqual([])
        })
      } else {
        it('should reset values', () => {
          wrapper.vm.newTransactionsNotice = 'TEST NOTICE'
          wrapper.vm.totalCount = 10
          wrapper.vm.fetchedTransactions = [
            'fake entry'
          ]

          wrapper.vm.reset()

          expect(wrapper.vm.newTransactionsNotice).toBe(null)
          expect(wrapper.vm.totalCount).toBe(0)
          expect(wrapper.vm.fetchedTransactions).toEqual([])
        })
      }
    })

    describe('__updateParams', () => {
      const expected = {
        page: 1,
        limit: 10,
        sort: {
          field: 'timestamp',
          type: 'desc'
        }
      }

      it('should update query parameters', () => {
        const params = {
          page: 10,
          limit: 100,
          sort: {
            field: 'amount',
            type: 'asc'
          }
        }
        wrapper.vm.__updateParams(params)

        expect(wrapper.vm.queryParams).toEqual(params)
      })

      it('should not update if invalid value', () => {
        wrapper.vm.__updateParams(null)

        expect(wrapper.vm.queryParams).toEqual(expected)

        wrapper.vm.__updateParams([])

        expect(wrapper.vm.queryParams).toEqual(expected)

        wrapper.vm.__updateParams('test')

        expect(wrapper.vm.queryParams).toEqual(expected)
      })
    })
  })
})
