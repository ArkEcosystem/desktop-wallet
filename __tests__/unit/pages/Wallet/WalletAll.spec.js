import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { useI18n } from '../../__utils__/i18n'
import router from '@/router'
import WalletAll from '@/pages/Wallet/WalletAll'

const localVue = createLocalVue()
const i18n = useI18n(localVue)
localVue.use(VueRouter)

describe('pages > WalletAll', () => {
  const ledgerWallets = [
    { id: 'Aledger1', address: 'Aledger1', name: 'L1' },
    { id: 'Aledger2', address: 'Aledger2', name: 'L2' },
    { id: 'Aledger3', address: 'Aledger3', name: 'L3' }
  ]
  const wallets = [
    { id: 'A1', address: 'A1', name: 'N1' },
    { id: 'A2', address: 'A2', name: 'N2' },
    { id: 'A3', address: 'A3', name: 'N3' }
  ]

  const mountPage = () => {
    return mount(WalletAll, {
      localVue,
      router,
      i18n,
      mocks: {
        $store: {
          getters: {
            'ledger/isConnected': false,
            'ledger/wallets': ledgerWallets,
            'profile/balanceWithLedger': jest.fn(),
            'session/hasWalletGridLayout': true,
            'wallet/byProfileId': () => wallets
          }
        },
        session_network: {
          symbol: 'Ѧ',
          market: {
            enabled: true
          }
        },
        session_profile: {
          name: 'jest'
        },
        wallet_sortByName: () => wallets,
        formatter_networkCurrency: jest.fn(),
        wallet_name: value => value
      },
      stubs: {
        ButtonLetter: true
      }
    })
  }

  it('should have the right name', () => {
    const wrapper = mountPage()
    expect(wrapper.name()).toEqual('WalletAll')
  })

  it('should render component', () => {
    const wrapper = mountPage()
    expect(wrapper.contains('.WalletAll')).toBeTruthy()
  })

  describe('removeWallet', () => {
    it('should remove the wallet from the selectable wallets', () => {
      const wrapper = mountPage()

      wrapper.vm.selectableWallets = [
        wallets[0],
        wallets[1],
        wallets[2],
        ledgerWallets[0]
      ]
      wrapper.vm.removeWallet(wallets[1])

      const selectableWallets = [
        wallets[0],
        wallets[2],
        ledgerWallets[0]
      ]
      expect(wrapper.vm.selectableWallets).toEqual(selectableWallets)
    })
  })
})
