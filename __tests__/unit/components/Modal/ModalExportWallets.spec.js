import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import ModalExportWallets from '@/components/Modal/ModalExportWallets'
import StringMixin from '@/mixins/strings'
import WalletMixin from '@/mixins/wallet'

Vue.use(Vuelidate)

const i18n = useI18nGlobally()

describe('ModalExportWallets', () => {
  const mountComponent = () => {
    const wallets = [
      { address: 'A1', name: null, balance: 0 },
      { address: 'A2', name: '', balance: 1 },
      { address: 'A3', name: 'wallet_a3', balance: 0 },
      { address: 'A4', name: 'wallet_a4', balance: 1 }
    ]

    return shallowMount(ModalExportWallets, {
      i18n,
      mixins: [StringMixin, WalletMixin],
      mocks: {
        session_network: {
          knownWallets: {}
        },
        $store: {
          getters: {
            'delegate/byAddress': jest.fn(),
            'wallet/contactsByProfileId': () => [],
            'wallet/byProfileId': () => wallets
          }
        }
      }
    })
  }

  it('should render modal', () => {
    const wrapper = mountComponent()
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('toggleOption', () => {
    it('should exclude empty wallets', () => {
      const wrapper = mountComponent()
      wrapper.vm.toggleOption('wallet', 'excludeEmpty')

      const walletsWithBalance = [
        { address: 'A2', name: '', balance: 1 },
        { address: 'A4', name: 'wallet_a4', balance: 1 }
      ]

      expect(wrapper.vm.wallets).toEqual(walletsWithBalance)
    })

    it('should exclude wallets with no name', () => {
      const wrapper = mountComponent()
      wrapper.vm.toggleOption('wallet', 'excludeUnnamed')

      const walletsWithName = [
        { address: 'A3', name: 'wallet_a3', balance: 0 },
        { address: 'A4', name: 'wallet_a4', balance: 1 }
      ]

      expect(wrapper.vm.wallets).toEqual(walletsWithName)
    })
  })
})
