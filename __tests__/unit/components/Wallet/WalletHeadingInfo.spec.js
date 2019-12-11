import { createLocalVue, mount } from '@vue/test-utils'
import useI18n from '../../__utils__/i18n'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'
import truncate from '@/filters/truncate'
import { WalletHeadingInfo } from '@/components/Wallet'

const network = {
  token: 'NET',
  symbol: '×',
  fractionDigits: 8,
  market: {
    enabled: false
  },
  knownWallets: []
}

const sampleWalletData = {
  address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
  balance: 797.8921,
  profileId: 'abc'
}

const alternativeCurrency = 'EUR'
const price = 12

let wrapper

describe('WalletHeadingInfo component', () => {
  beforeEach(() => {
    const localVue = createLocalVue()
    const i18n = useI18n(localVue)

    localVue.filter('truncate', truncate)

    wrapper = mount(WalletHeadingInfo, {
      localVue,
      i18n,
      mixins: [CurrencyMixin, FormatterMixin],
      propsData: sampleWalletData,
      mocks: {
        $store: {
          getters: {
            'market/lastPrice': price,
            'network/byToken': jest.fn(),
            'network/bySymbol': jest.fn(),
            'session/network': network,
            'session/currency': alternativeCurrency,
            'transaction/byAddress': jest.fn(() => [])
          }
        },
        session_network: network,
        wallet_fromRoute: sampleWalletData,
        wallet_formatAddress: address => address,
        wallet_name: value => value,
        wallet_nameOnContact: value => value,
        wallet_nameOnProfile: value => value,
        wallet_truncate: value => value
      }
    })
  })

  it('should be instatiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should display the identicon', () => {
    const identicon = wrapper.find('.WalletHeading__identicon')

    expect(identicon.html()).toContain('class="Identicon')
  })

  it('should not allow selecting the identicon badge', () => {
    const identicon = wrapper.find('.WalletHeading__identicon')

    expect(identicon.html()).toContain('select-none')
  })

  it('should display the address', () => {
    const address = wrapper.find('.WalletHeading__address')

    expect(address.text()).toContain(sampleWalletData.address)
  })

  it('should display the balance in the currency network', () => {
    const balance = wrapper.find('.WalletHeading__balance')

    const arkBalance = wrapper.vm.currency_subToUnit(sampleWalletData.balance)
    const formattedBalance = wrapper.vm.currency_format(arkBalance, { currencyFrom: 'network' })

    expect(balance.text()).toContain(formattedBalance)
  })

  describe('when the session network has the market enabled', () => {
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
