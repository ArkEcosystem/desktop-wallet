import { createLocalVue, shallowMount } from '@vue/test-utils'
import installI18n from '../../__utils__/i18n'
import WalletSidebar from '@/components/Wallet/WalletSidebar'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

const contacts = [
]
const wallets = [
]

const mount = (propsData = {}, mocks = {}) => {
  mocks = {
    $store: {
      getters: {
        'wallet/contactsByProfileId': () => contacts,
        'wallet/byProfileId': () => wallets
      }
    },
    wallet_sortByName: jest.fn(),
    ...mocks
  }

  return shallowMount(WalletSidebar, {
    propsData,
    i18n,
    localVue,
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
      { address: 'A1', isLedger: false, balance: 23 },
      { address: 'A2', isLedger: false, balance: 22 }
    ]
    const ledgerWallets = [
      { address: 'Aledger1', isLedger: true, balance: 10 },
      { address: 'Aledger2', isLedger: true, balance: 12 }
    ]
    const emptyWallets = [
      { address: 'A3', isLedger: false, balance: 0 },
      { address: 'Aledger3', isLedger: true, balance: 0 }
    ]
    const allWallets = [
      ...wallets,
      ...ledgerWallets,
      ...emptyWallets
    ]

    describe('when no filter is passedd', () => {
      it('should return all wallets', () => {
        const wrapper = mount()

        expect(wrapper.vm.filterWallets(allWallets)).toEqual(allWallets)
      })
    })

    describe('when several filters are passedd', () => {
      it('should return the wallets that pass them all', () => {
        const wrapper = mount()
        wrapper.vm.applyFilters({
          hideEmpty: true,
          hideLedger: true
        })

        expect(wrapper.vm.filterWallets(allWallets)).toEqual(wallets)
      })
    })

    describe('when `hideLedger` is enabled', () => {
      it('should not return the Ledger wallets', () => {
        const wrapper = mount()
        wrapper.vm.applyFilters({
          hideLedger: true
        })

        expect(wrapper.vm.filterWallets(allWallets)).toEqual([
          ...wallets,
          emptyWallets[0]
        ])
      })
    })

    describe('when `hideEmpty` is enabled', () => {
      it('should not return the empty wallets', () => {
        const wrapper = mount()
        wrapper.vm.applyFilters({
          hideEmpty: true
        })

        expect(wrapper.vm.filterWallets(allWallets)).toEqual([
          ...wallets,
          ...ledgerWallets
        ])
      })
    })

    describe('when a search query (`searchQuery`) is passed', () => {
      const wallets = [
        { address: 'A1xd', name: 'example', balance: 132.23 },
        { address: 'A2xd', name: 'name', balance: 13 },
        { address: 'A3dx', name: 'other', balance: 937 }
      ]

      let wrapper
      // eslint-disable-next-line camelcase
      let wallet_name

      beforeEach(() => {
        // eslint-disable-next-line camelcase
        wallet_name = jest.fn().mockImplementation(address => {
          return wallets.find(wallet => wallet.address === address).name
        })
        wrapper = mount({}, {
          wallet_name
        })
      })

      it('should use the `wallet_name` mixin method', () => {
        wrapper.vm.applyFilters({
          searchQuery: '.'
        })
        wrapper.vm.filterWallets(wallets)

        wallets.forEach(wallet => {
          expect(wallet_name).toHaveBeenCalledWith(wallet.address)
        })
      })

      describe('when wallet addresses match', () => {
        it('should return only those wallets', () => {
          wrapper.vm.applyFilters({
            searchQuery: 'xd'
          })

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0],
            wallets[1]
          ])
        })
      })

      describe('when wallet balances match', () => {
        it('should return only those wallets', () => {
          wrapper.vm.applyFilters({
            searchQuery: 13
          })

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0],
            wallets[1]
          ])
        })
      })

      describe('when wallet names match', () => {
        it('should return only those wallets', () => {
          wrapper.vm.applyFilters({
            searchQuery: 'am'
          })

          expect(wrapper.vm.filterWallets(wallets)).toEqual([
            wallets[0],
            wallets[1]
          ])
        })
      })
    })
  })
})
