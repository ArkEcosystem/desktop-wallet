import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { useI18n } from '../../__utils__/i18n'
import router from '@/router'
import CurrencyMixin from '@/mixins/currency'
import ProfileAll from '@/pages/Profile/ProfileAll'

const localVue = createLocalVue()
const i18n = useI18n(localVue)
localVue.use(VueRouter)

describe('pages > ProfileAll', () => {
  let wrapper
  let networks
  let profiles
  let wallets

  const mountPage = () => {
    const networkBy = (attr, value) => networks.find(network => network[attr] === value)

    return mount(ProfileAll, {
      localVue,
      router,
      i18n,
      mixins: [CurrencyMixin],
      mocks: {
        $store: {
          getters: {
            'network/byId': id => networkBy('id', id),
            'network/byToken': token => networkBy('token', token),
            'network/bySymbol': symbol => networkBy('symbol', symbol),
            'profile/all': profiles,
            'profile/balance': _id => 13700000,
            'wallet/byProfileId': id => wallets[id]
          }
        },
        formatter_networkCurrency: jest.fn()
      }
    })
  }

  beforeEach(() => {
    networks = [
      { id: 'main', symbol: 'm', token: 'MAI', subunit: 'mainito', fractionDigits: 8 },
      { id: 'other', symbol: 'o', token: 'OTH', subunit: 'another', fractionDigits: 8 },
      { id: 'dev', symbol: 'd', token: 'DEV', subunit: 'devin', fractionDigits: 8 }
    ]
    profiles = [
      { id: 'p1', networkId: 'main' },
      { id: 'p2', networkId: 'other' },
      { id: 'p3', networkId: 'main' },
      { id: 'p4', networkId: 'dev' }
    ]
    wallets = {
      p1: [
        { address: 'M0', balance: 1000 },
        { address: 'M1', balance: 15089900 }
      ],
      p2: [
        { address: 'O0', balance: 12000000 },
        { address: 'O1', balance: 190000 }
      ],
      p3: [
        { address: 'M2', balance: 0 },
        { address: 'M3', balance: 50000000000 }
      ],
      p4: [
        { address: 'D0', balance: 1110000 },
        { address: 'D1', balance: 50900000 }
      ]
    }
  })

  it('should render component', () => {
    wrapper = mountPage()
    expect(wrapper.contains('.ProfileAll')).toBeTruthy()
  })

  describe('aggregatedBalances', () => {
    it('should aggregate the sum of the balances of all profiles by network', () => {
      wrapper = mountPage()
      expect(wrapper.vm.aggregatedBalances).toEqual({
        main: 50015090900,
        other: 12190000,
        dev: 52010000
      })
    })

    describe('when there are profiles with the same wallets', () => {
      beforeEach(() => {
        wallets.p3[1] = wallets.p1[0]
      })

      it('should include those wallets only 1 time', () => {
        wrapper = mountPage()
        expect(wrapper.vm.aggregatedBalances).toEqual({
          main: 15090900,
          other: 12190000,
          dev: 52010000
        })
      })
    })
  })

  describe('totalBalances', () => {
    it('should return the sum of balances per network, using their symbols', () => {
      wrapper = mountPage()
      expect(wrapper.vm.totalBalances).toEqual([
        'm500.150909',
        'o0.1219',
        'd0.5201'
      ])
    })
  })

  describe('profileBalance', () => {
    it('should return the formatted balance of a profile, using the network symbol', () => {
      wrapper = mountPage()
      expect(wrapper.vm.profileBalance(profiles[0])).toEqual('m0.137')
    })
  })
})
