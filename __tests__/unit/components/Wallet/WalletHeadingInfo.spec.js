import { createLocalVue, mount } from '@vue/test-utils'
import useI18n from '../../__utils__/i18n'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'
import { WalletHeadingInfo } from '@/components/Wallet'

const network = {
  token: 'NET',
  symbol: '×',
  fractionDigits: 8,
  market: {
    enabled: false
  }
}

const sampleWalletData = {
  identicon: '<div class="Identicon WalletHeading__identicon" style="background: rgb(198, 40, 81); height: 100px; width: 100px;"><svg width="100" height="100" x="0" y="0"><rect width="100" height="100" transform="translate(-4.949028905440344 -5.6348829242521274) rotate(313.3 50 50)" fill="#6C295B" x="0" y="0"></rect><rect width="100" height="100" transform="translate(38.61589480562664 36.605112514646756) rotate(175.3 50 50)" fill="#833B69" x="0" y="0"></rect><rect width="100" height="100" transform="translate(81.8625347893115 14.543059153493719) rotate(114.1 50 50)" fill="#76102C" x="0" y="0"></rect></svg></div>',
  address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
  balance: 797.8921
}

const alternativeCurrency = 'EUR'
const price = 12

let wrapper

describe('WalletHeadingInfo component', () => {
  beforeEach(() => {
    const localVue = createLocalVue()
    const i18n = useI18n(localVue)

    wrapper = mount(WalletHeadingInfo, {
      localVue,
      i18n,
      mixins: [CurrencyMixin, FormatterMixin],
      propsData: sampleWalletData,
      mocks: {
        $store: {
          getters: {
            'market/lastPrice': price,
            'session/network': network,
            'session/currency': alternativeCurrency
          }
        },
        session_network: network,
        wallet_fromRoute: sampleWalletData,
        wallet_formatAddress: address => address
      }
    })
  })

  it('should be instatiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should display the identicon', () => {
    const identicon = wrapper.find('.WalletHeading__identicon')

    expect(identicon.html()).toBe(sampleWalletData.identicon)
  })

  it('should display the address', () => {
    const address = wrapper.find('.WalletHeading__address')

    expect(address.text()).toBe(sampleWalletData.address)
  })

  it('should display the balance in the currency network', () => {
    const balance = wrapper.find('.WalletHeading__balance')

    const arkBalance = wrapper.vm.currency_subToUnit(sampleWalletData.balance)
    const formattedBalance = wrapper.vm.currency_format(arkBalance, { currencyFrom: 'network' })

    expect(balance.text()).toContain(formattedBalance)
  })

  describe('when the network has market enabled', () => {
    beforeEach(() => {
      network.market.enabled = true
    })

    it('should display the balance in the alternative currency too', () => {
      const balance = wrapper.find('.WalletHeading__balance__alternative')

      const arkBalance = wrapper.vm.currency_subToUnit(sampleWalletData.balance)
      const formattedBalance = wrapper.vm.currency_format(arkBalance * price, { currency: alternativeCurrency })

      expect(balance.text()).toContain(formattedBalance)
    })
  })
})
