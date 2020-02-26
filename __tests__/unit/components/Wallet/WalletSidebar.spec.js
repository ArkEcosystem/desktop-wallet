import { createLocalVue, shallowMount } from '@vue/test-utils'
import installI18n from '../../__utils__/i18n'
import WalletMixin from '@/mixins/wallet'
import WalletSidebar from '@/components/Wallet/WalletSidebar'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

const contacts = [
]
const wallets = [
]

const mount = (propsData = {}, mocks = {}) => {
  mocks = {
    $route: {},
    $store: {
      getters: {
        'delegate/byAddress': jest.fn(),
        'wallet/contactsByProfileId': () => contacts,
        'wallet/byProfileId': () => wallets,
        'session/walletSidebarFilters': { hideEmpty: false, hideLedger: false },
        'session/walletSidebarSortParams': { field: 'name', type: 'asc' }
      },
      dispatch: jest.fn()
    },
    session_network: {
      knownWallets: {}
    },
    ...mocks
  }

  return shallowMount(WalletSidebar, {
    propsData,
    i18n,
    localVue,
    mixins: [WalletMixin],
    mocks
  })
}

describe('WalletSidebar', () => {
  it('should be instantiated', () => {
    const wrapper = mount()
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('filterWallets', () => {
    const wallets = [
      { address: 'A1', isLedger: false, balance: '23' },
      { address: 'A2', isLedger: false, balance: '22' }
    ]
    const ledgerWallets = [
      { address: 'Aledger1', isLedger: true, balance: '10' },
      { address: 'Aledger2', isLedger: true, balance: '12' }
    ]
    const emptyWallets = [
      { address: 'A3', isLedger: false, balance: '0' },
      { address: 'Aledger3', isLedger: true, balance: '0' }
    ]
    const allWallets = [
      ...wallets,
      ...ledgerWallets,
      ...emptyWallets
    ]

    describe('when no filter is passed', () => {
      it('should return all wallets', () => {
        const wrapper = mount()

        expect(wrapper.vm.filterWallets(allWallets)).toEqual(allWallets)
      })
    })

    describe('when several filters are passed', () => {
      it('should return the wallets that pass them all', () => {
        const wrapper = mount()
        const filters = {
          hideEmpty: true,
          hideLedger: true
        }

        wrapper.vm.$store.getters['session/walletSidebarFilters'] = filters

        wrapper.vm.applyFilters(filters)

        expect(wrapper.vm.filterWallets(allWallets)).toEqual(wallets)
      })
    })

    describe('when `hideLedger` is enabled', () => {
      it('should not return the Ledger wallets', () => {
        const wrapper = mount()
        const filters = {
          hideLedger: true
        }

        wrapper.vm.$store.getters['session/walletSidebarFilters'] = filters

        wrapper.vm.applyFilters(filters)

        expect(wrapper.vm.filterWallets(allWallets)).toEqual([
          ...wallets,
          emptyWallets[0]
        ])
      })
    })

    describe('when `hideEmpty` is enabled', () => {
      it('should not return the empty wallets', () => {
        const wrapper = mount()
        const filters = {
          hideEmpty: true
        }

        wrapper.vm.$store.getters['session/walletSidebarFilters'] = filters

        wrapper.vm.applyFilters(filters)

        expect(wrapper.vm.filterWallets(allWallets)).toEqual([
          ...wallets,
          ...ledgerWallets
        ])
      })
    })

    describe('when a search query (`searchQuery`) is passed', () => {
      const wallets = [
        { address: 'A1xd', name: 'example', balance: '13223' },
        { address: 'A2xd', name: 'name', balance: '13' },
        { address: 'A3dx', name: 'other', balance: '937' }
      ]

      let wrapper

      beforeEach(() => {
        wrapper = mount()
      })

      describe('when wallet addresses match', () => {
        it('should return only those wallets', () => {
          wrapper.vm.applySearch('xd')

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0],
            wallets[1]
          ])
        })

        it('should not ignore the case', () => {
          wrapper.vm.applySearch('Xd')

          expect(wrapper.vm.filterWallets(wallets)).toBeEmpty()
        })
      })

      describe('when wallet balances match', () => {
        it('should return only those wallets', () => {
          wrapper.vm.applySearch('13')

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0],
            wallets[1]
          ])
        })
      })

      describe('when wallet names match', () => {
        it('should return only those wallets', () => {
          wrapper.vm.applySearch('am')

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0],
            wallets[1]
          ])
        })

        it('should ignore the case', () => {
          wrapper.vm.applySearch('Am')

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0],
            wallets[1]
          ])
        })
      })

      describe('when wallet alternative (delegate, network, etc.) names match', () => {
        it('should return only those wallets', () => {
          wrapper.vm.wallet_name = jest.fn().mockImplementation(address => {
            const wallet = wallets.find(wallet => wallet.address === address)
            return `${wallet.name}s`
          })
          wrapper.vm.applySearch('examples')

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0]
          ])
        })

        it('should ignore the case', () => {
          wrapper.vm.wallet_name = jest.fn().mockImplementation(address => {
            const wallet = wallets.find(wallet => wallet.address === address)
            return `${wallet.name}s`
          })
          wrapper.vm.applySearch('eXaMples')

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0]
          ])
        })
      })
    })
  })

  describe('sortWallets', () => {
    const wallets = [
      { address: 'AA', name: 'example', balance: '132' },
      { address: 'AD', name: '', balance: '0' },
      { address: 'AB', name: 'name', balance: '13' },
      { address: 'AC', name: 'other', balance: '937' }
    ]

    let wrapper

    beforeEach(() => {
      wrapper = mount()
    })

    describe('when the order is `name-asc`', () => {
      beforeEach(() => {
        wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'name', type: 'asc' }
      })

      it('should sort the wallets by name ascendently', () => {
        wrapper.vm.applySortOrder({ field: 'name', type: 'asc' })

        expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
          wallets[1],
          wallets[0],
          wallets[2],
          wallets[3]
        ])
      })
    })

    describe('when the order is `name-desc`', () => {
      beforeEach(() => {
        wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'name', type: 'desc' }
      })

      it('should sort the wallets by name descendently', () => {
        wrapper.vm.applySortOrder({ field: 'name', type: 'desc' })

        expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
          wallets[3],
          wallets[2],
          wallets[0],
          wallets[1]
        ])
      })
    })

    describe('when the order is `balance-asc`', () => {
      beforeEach(() => {
        wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'balance', type: 'asc' }
      })

      it('should sort the wallets by balance ascendently', () => {
        wrapper.vm.applySortOrder({ field: 'balance', type: 'asc' })

        expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
          wallets[1],
          wallets[2],
          wallets[0],
          wallets[3]
        ])
      })
    })

    describe('when the order is `balance-desc`', () => {
      beforeEach(() => {
        wrapper.vm.$store.getters['session/walletSidebarSortParams'] = { field: 'balance', type: 'desc' }
      })

      it('should sort the wallets by balance descendently', () => {
        wrapper.vm.applySortOrder({ field: 'balance', type: 'desc' })

        expect(wrapper.vm.sortWallets(wallets.slice())).toEqual([
          wallets[3],
          wallets[0],
          wallets[2],
          wallets[1]
        ])
      })
    })
  })
})
