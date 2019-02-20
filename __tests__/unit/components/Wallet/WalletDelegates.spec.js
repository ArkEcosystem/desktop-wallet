import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { WalletDelegates } from '@/components/Wallet'

const i18n = useI18nGlobally()

describe('WalletDelegates', () => {
  let showExplanation
  let walletVote = {}

  const mountWrapper = () => {
    return mount(WalletDelegates, {
      i18n,
      provide: {
        walletVote
      },
      mocks: {
        session_network: {
          constants: {
            activeDelegates: 51
          }
        },
        $store: {
          getters: {
            'app/showVotingExplanation': showExplanation
          }
        },
        $logger: {
          error: () => {}
        },
        $error: () => {}
      },
      stubs: {
        'TableWrapper': true
      }
    })
  }

  it('should render', () => {
    const wrapper = mountWrapper()
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('when the wallet is voting', () => {
    beforeEach(() => {
      walletVote = { publicKey: 'key' }
      showExplanation = true
    })

    it('should not display the voting explanation', () => {
      const wrapper = mountWrapper()
      expect(wrapper.find('.WalletDelegates__explanation').exists()).toBeFalse()
    })
  })

  describe('when the wallet is not voting', () => {
    beforeEach(() => {
      walletVote = {}
    })

    describe('when the voting explanation has not been closed', () => {
      beforeEach(() => {
        showExplanation = true
      })

      it('should display it', () => {
        const wrapper = mountWrapper()
        expect(wrapper.find('.WalletDelegates__explanation').exists()).toBeTrue()
      })
    })

    describe('when the voting explanation has been closed', () => {
      beforeEach(() => {
        showExplanation = false
      })

      it('should not display it', () => {
        const wrapper = mountWrapper()
        expect(wrapper.find('.WalletDelegates__explanation').exists()).toBeFalse()
      })
    })
  })
})
