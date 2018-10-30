import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'
import WalletMixin from '@/mixins/wallet'

describe('Mixins > Wallet', () => {
  const defaultLocale = 'en-US'
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

    localVue.use(VueI18n)

    const i18n = new VueI18n({
      locale: defaultLocale,
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
          }
        }
      }
    })

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
