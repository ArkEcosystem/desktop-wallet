import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import { WalletBusinessBridgechains } from '@/components/Wallet/WalletBusiness'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
let clientFetchBridgechainsMock
let eventOnMock
let eventOffMock
let storeDispatchMock
const createWrapper = (component) => {
  component = component || WalletBusinessBridgechains

  eventOnMock = jest.fn()
  eventOffMock = jest.fn()
  storeDispatchMock = jest.fn()
  clientFetchBridgechainsMock = jest.fn(() => ({
    data: [],
    meta: {
      count: 0,
      pageCount: 1,
      totalCount: 0,
      next: null,
      previous: null,
      self: '/api/businesses/public-key-1/bridgechains?page=1&limit=100',
      first: '/api/businesses/public-key-1/bridgechains?page=1&limit=100',
      last: null
    }
  }))

  wrapper = mount(component, {
    i18n,
    localVue,
    mocks: {
      $client: {
        fetchBusinessBridgechains: clientFetchBridgechainsMock
      },
      $eventBus: {
        on: eventOnMock,
        off: eventOffMock
      },
      $store: {
        dispatch: storeDispatchMock,
        getters: {
          get 'session/transactionTableRowCount' () {
            return 10
          }
        }
      },
      session_profile: {
        id: 1
      }
    },
    mixins: [
      {
        data: () => ({
          mockWalletRoute: 1
        }),
        computed: {
          wallet_fromRoute () {
            return {
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
      }
    ],
    stubs: {
      WalletBusinessBridgechainsTable: `<div>
        <div class="WalletBusinessBridgechainsTable"></div>
      </div>`
    }
  })
}

describe('WalletBusinessBridgechains', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletBusinessBridgechains')).toBe(true)
  })

  it('should include WalletBusinessBridgechainsTable component', () => {
    expect(wrapper.contains('.WalletBusinessBridgechainsTable')).toBe(true)
  })

  it('should reset when wallet route changes', async () => {
    const spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains').mockImplementation(jest.fn())
    const spyReset = jest.spyOn(wrapper.vm, 'reset').mockImplementation(jest.fn())

    wrapper.setData({
      mockWalletRoute: 2
    })

    expect(wrapper.vm.wallet_fromRoute.address).toEqual('address-2')

    expect(spyLoadBridgechains).toHaveBeenCalledTimes(1)
    expect(spyReset).toHaveBeenCalledTimes(1)
  })

  describe('created', () => {
    const spy = jest.spyOn(WalletBusinessBridgechains.methods, 'loadBridgechains').mockImplementation(jest.fn())
    createWrapper()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(eventOnMock).toHaveBeenCalledTimes(1)
    expect(eventOnMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadBridgechains)

    spy.mockRestore()
  })

  describe('beforeDestroy', () => {
    wrapper.destroy()
    expect(eventOffMock).toHaveBeenCalledTimes(1)
    expect(eventOffMock).toHaveBeenCalledWith('wallet:reload', wrapper.vm.loadBridgechains)
  })

  describe('fetchBridgechains', () => {
    it('should not run if already fetching', () => {
      clientFetchBridgechainsMock.mockClear()

      wrapper.vm.isFetching = true
      wrapper.vm.fetchBridgechains()

      expect(clientFetchBridgechainsMock).not.toHaveBeenCalled()
    })

    it('should fetch bridgechains via client', async () => {
      const clientFetchBridgechains = clientFetchBridgechainsMock()
      clientFetchBridgechainsMock.mockClear().mockImplementation(() => {
        clientFetchBridgechains.data = [
          'test'
        ]
        clientFetchBridgechains.meta.totalCount = 100

        return clientFetchBridgechains
      })

      const params = {
        page: 10,
        limit: 100,
        sort: {
          field: 'amount',
          type: 'asc'
        }
      }
      wrapper.vm.__updateParams(params)
      wrapper.vm.fetchBridgechains()

      expect(clientFetchBridgechainsMock).toHaveBeenCalledTimes(1)
      expect(clientFetchBridgechainsMock).toHaveBeenCalledWith('public-key-1', {
        page: params.page,
        limit: params.limit,
        orderBy: `${params.sort.field}:${params.sort.type}`
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.fetchedBridgechains).toEqual([
        'test'
      ])
      expect(wrapper.vm.totalCount).toBe(100)
    })

    it('should clear bridgechains on error', async () => {
      clientFetchBridgechainsMock.mockClear().mockImplementation(() => {
        throw new Error('Failed')
      })

      wrapper.vm.fetchedBridgechains = [
        'test'
      ]
      wrapper.vm.totalCount = 100
      wrapper.vm.fetchBridgechains()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.fetchedBridgechains).toEqual([])
      expect(wrapper.vm.totalCount).toBe(0)
    })
  })

  describe('loadBridgechains', () => {
    it('should not load if not viewing a wallet', () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchBridgechains')
      jest.spyOn(wrapper.vm, 'wallet_fromRoute', 'get').mockReturnValue(null)

      wrapper.vm.loadBridgechains()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not load if already fetching', () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchBridgechains')

      wrapper.vm.isFetching = true
      wrapper.vm.loadBridgechains()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should load bridgechains', () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchBridgechains').mockImplementation()

      wrapper.vm.loadBridgechains()

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('onPageChange', () => {
    it('should change page', () => {
      const currentPage = 2
      const spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams')
      const spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains')

      wrapper.vm.onPageChange({ currentPage })

      expect(wrapper.vm.currentPage).toBe(currentPage)

      expect(spyUpdateParams).toHaveBeenCalledTimes(1)
      expect(spyUpdateParams).toHaveBeenCalledWith({ page: currentPage })
      expect(spyLoadBridgechains).toHaveBeenCalledTimes(1)
    })
  })

  describe('onPerPageChange', () => {
    it('should update page row count', () => {
      const currentPerPage = 1
      const spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams')
      const spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains')

      wrapper.vm.onPerPageChange({ currentPerPage })

      expect(storeDispatchMock).toHaveBeenCalledWith('session/setTransactionTableRowCount', currentPerPage)
      expect(storeDispatchMock).toHaveBeenCalledWith('profile/update', {
        id: 1,
        transactionTableRowCount: currentPerPage
      })

      expect(spyUpdateParams).toHaveBeenCalledTimes(1)
      expect(spyUpdateParams).toHaveBeenCalledWith({ limit: currentPerPage, page: 1 })
      expect(spyLoadBridgechains).toHaveBeenCalledTimes(1)
    })
  })

  describe('onSortChange', () => {
    let spyUpdateParams, spyLoadBridgechains

    beforeEach(() => {
      spyUpdateParams = jest.spyOn(wrapper.vm, '__updateParams')
      spyLoadBridgechains = jest.spyOn(wrapper.vm, 'loadBridgechains')
    })

    it('should update sort column', () => {
      wrapper.vm.onSortChange({
        source: 'from-third-party-component',
        field: 'amount',
        type: 'desc'
      })

      expect(spyUpdateParams).toHaveBeenCalledTimes(1)
      expect(spyUpdateParams).toHaveBeenCalledWith({
        sort: {
          field: 'amount',
          type: 'desc'
        },
        page: 1
      })
      expect(spyLoadBridgechains).toHaveBeenCalledTimes(1)
    })

    it('should update sort column direction', () => {
      wrapper.vm.onSortChange({
        source: 'from-third-party-component',
        field: 'timestamp',
        type: 'asc'
      })

      expect(spyUpdateParams).toHaveBeenCalledTimes(1)
      expect(spyUpdateParams).toHaveBeenCalledWith({
        sort: {
          field: 'timestamp',
          type: 'asc'
        },
        page: 1
      })
      expect(spyLoadBridgechains).toHaveBeenCalledTimes(1)
    })

    it('should not do anything if source is falsy', () => {
      wrapper.vm.onSortChange({
        source: null,
        field: 'amount',
        type: 'desc'
      })

      expect(spyUpdateParams).toHaveBeenCalledTimes(0)
      expect(spyLoadBridgechains).toHaveBeenCalledTimes(0)
    })

    it('should not do anything if column and direction do not change', () => {
      wrapper.vm.onSortChange({
        source: 'from-third-party-component',
        field: 'timestamp',
        type: 'desc'
      })

      expect(spyUpdateParams).toHaveBeenCalledTimes(0)
      expect(spyLoadBridgechains).toHaveBeenCalledTimes(0)
    })
  })

  describe('reset', () => {
    it('should reset values', () => {
      wrapper.vm.currentPage = 10
      wrapper.vm.queryParams.page = 10
      wrapper.vm.totalCount = 10
      wrapper.vm.fetchedBridgechains = [
        'fake entry'
      ]

      wrapper.vm.reset()

      expect(wrapper.vm.currentPage).toBe(1)
      expect(wrapper.vm.queryParams.page).toBe(1)
      expect(wrapper.vm.totalCount).toBe(0)
      expect(wrapper.vm.fetchedBridgechains).toEqual([])
    })
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
