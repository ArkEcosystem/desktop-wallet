import { createLocalVue, mount } from '@vue/test-utils'
import backgroundWorker from '@/plugins/background-worker'
import WalletNew from '@/pages/Wallet/WalletNew'
import WalletService from '@/services/wallet'

const localVue = createLocalVue()
localVue.use(backgroundWorker)

describe('pages > WalletNew', () => {
  const mountPage = () => {
    return mount(WalletNew, {
      localVue,
      mocks: {
        schema: {},
        $v: {
          step1: {},
          step3: {},
          step4: {},
          step5: {},
          schema: {
            name: {},
            isSendingEnabled: {}
          },
          model: {}
        }
      }
    })
  }

  it('should have the right name', () => {
    const wrapper = mountPage()
    expect(wrapper.name()).toEqual('WalletNew')
  })

  it('should render component', () => {
    const wrapper = mountPage()
    expect(wrapper.contains('.WalletNew')).toBeTruthy()
  })

  describe('computed additionalSuggestions', () => {
    it('should mix and shuffle the words of all the passphrases', () => {
      const wallets = {
        A1: 'word1 word2 word3 word4',
        A2: 'first second third fourth',
        A3: 'lemon orange grape banana'
      }
      const words = [
        ...wallets.A1.split(' '),
        ...wallets.A2.split(' '),
        ...wallets.A3.split(' ')
      ]

      const wrapper = mountPage()
      wrapper.setData({ wallets })

      expect(wrapper.vm.additionalSuggestions).toIncludeAllMembers(words)
    })
  })

  describe('refreshAddresses', () => {
    it('should generate 4 wallets', async () => {
      const wrapper = mountPage()
      WalletService.generate.mockClear()

      wrapper.vm.refreshAddresses()

      // There is a delay to play an animation
      await setTimeout(() => {
        expect(WalletService.generate).toHaveBeenCalledTimes(4)
      }, 500)
    })
  })
})
