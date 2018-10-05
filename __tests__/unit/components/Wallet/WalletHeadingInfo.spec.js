import { createLocalVue, mount } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import CurrencyMixin from '@/mixins/currency'
import { WalletHeadingInfo } from '@/components/Wallet'

const locale = 'en-US'

const network = {
  token: 'NET',
  symbol: '×',
  fractionDigits: 8
}

const sampleWalletData = {
  identicon: 'https://api.adorable.io/avatars/285/abott@adorable.png',
  address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
  balance: 797.8921
}

let wrapper

describe('WalletHeadingInfo component', () => {
  beforeEach(() => {
    const localVue = createLocalVue()

    localVue.use(VueI18n)

    const i18n = new VueI18n({
      locale,
      numberFormats: {
        [locale]: {
          currency: {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
          }
        }
      }
    })

    wrapper = mount(WalletHeadingInfo, {
      localVue,
      i18n,
      mixins: [CurrencyMixin],
      propsData: sampleWalletData,
      mocks: {
        $store: {
          getters: {
            'session/currentNetwork': network
          }
        },
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

    expect(identicon.attributes().src).toBe(sampleWalletData.identicon)
  })

  it('should display the address', () => {
    const address = wrapper.find('.WalletHeading__address')

    expect(address.text()).toBe(sampleWalletData.address)
  })

  it('should display the balance', () => {
    const balance = wrapper.find('.WalletHeading__balance')

    const arkBalance = wrapper.vm.currency_subToUnit(sampleWalletData.balance)
    const formattedBalance = wrapper.vm.currency_format(arkBalance, { currencyFrom: 'network' })

    expect(balance.text()).toContain(formattedBalance)
  })
})
