import { createLocalVue, shallowMount } from '@vue/test-utils'
import useI18n from '../__utils__/i18n'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'
import WalletMixin from '@/mixins/wallet'

describe('Mixins > Wallet', () => {
  const network = {
    token: 'NET',
    symbol: '×',
    fractionDigits: 8,
    knownWallets: [],
    version: 11
  }

  const walletsByProfile = []
  const contactsByProfile = []

  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()
    const i18n = useI18n(localVue)

    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    wrapper = shallowMount(TestComponent, {
      localVue,
      i18n,
      mixins: [CurrencyMixin, FormatterMixin, WalletMixin],
      mocks: {
        session_network: network,
        $store: {
          getters: {
            'wallet/byProfileId': id => walletsByProfile,
            'wallet/contactsByProfileId': id => contactsByProfile
          }
        }
      }
    })
  })

  describe('wallet_formatAddress', () => {
    describe('when receiving an address that is not known wallet, included on the profile or is a contact', () => {
      it('should return the entire address', () => {
        expect(wrapper.vm.wallet_formatAddress('AeXAmpleWiThLongName')).toEqual('AeXAmpleWiThLongName')
      })

      describe('whent the `truncateLength` is passed', () => {
        it('should return the address, but truncated', () => {
          expect(wrapper.vm.wallet_formatAddress('AeXAmpleWiThLongName', 5)).toEqual('Ae…me')
        })
      })
    })
  })
})
