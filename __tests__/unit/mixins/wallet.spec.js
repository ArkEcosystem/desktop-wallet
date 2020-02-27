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

  let wrapper
  let walletsByProfile
  let contactsByProfile

  beforeEach(() => {
    const localVue = createLocalVue()
    const i18n = useI18n(localVue)

    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    walletsByProfile = []
    contactsByProfile = []

    wrapper = shallowMount(TestComponent, {
      localVue,
      i18n,
      mixins: [CurrencyMixin, FormatterMixin, WalletMixin],
      mocks: {
        session_network: network,
        $store: {
          getters: {
            'wallet/byProfileId': () => walletsByProfile,
            'wallet/contactsByProfileId': () => contactsByProfile,
            'delegate/byAddress': (address) => {
              if (address === 'DTRdbaUW3RQQSL5By4G43JVaeHiqfVp9oh') {
                return {
                  username: 'test',
                  address,
                  publicKey: '034da006f958beba78ec54443df4a3f52237253f7ae8cbdb17dccf3feaa57f3126'
                }
              }
            }
          }
        }
      }
    })
  })

  describe('wallet_nameOnContact', () => {
    describe('when the contacts includes the wallet address', () => {
      it('should return the its name', () => {
        const address = 'AeXAmpleWiThLongName'
        contactsByProfile = [
          { address, name: 'example' }
        ]
        expect(wrapper.vm.wallet_nameOnContact(address)).toEqual(contactsByProfile[0].name)
      })
    })

    describe('when the profile does not include the wallet address', () => {
      it('should return `undefined`', () => {
        expect(wrapper.vm.wallet_nameOnContact('AeXAmpleWiThLongName', 5)).toBeNull()
      })
    })
  })

  describe('wallet_nameOnProfile', () => {
    describe('when the profile includes the wallet address', () => {
      it('should return the its name', () => {
        const address = 'AeXAmpleWiThLongName'
        walletsByProfile = [
          { address, name: 'example' }
        ]
        expect(wrapper.vm.wallet_nameOnProfile(address)).toEqual(walletsByProfile[0].name)
      })
    })

    describe('when the profile does not include the wallet address', () => {
      it('should return `undefined`', () => {
        expect(wrapper.vm.wallet_nameOnContact('AeXAmpleWiThLongName', 5)).toBeNull()
      })
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
