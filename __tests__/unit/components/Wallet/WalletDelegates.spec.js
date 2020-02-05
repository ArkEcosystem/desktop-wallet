import { merge } from 'lodash'
import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { WalletDelegates } from '@/components/Wallet'

const i18n = useI18nGlobally()

describe('WalletDelegates', () => {
  let showExplanation
  let walletVote = {}

  const activeDelegatesMock = count => {
    return {
      mocks: {
        session_network: {
          constants: {
            activeDelegates: count
          }
        }
      }
    }
  }

  const mountWrapper = config => {
    return mount(WalletDelegates, merge({
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
        TableWrapper: true
      }
    }, config))
  }

  it('should render', () => {
    const wrapper = mountWrapper()
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should dynamically calculate the per page options', () => {
    let wrapper = mountWrapper(activeDelegatesMock(25))
    expect(wrapper.vm.perPageOptions).toEqual([25])

    wrapper = mountWrapper(activeDelegatesMock(53))
    expect(wrapper.vm.perPageOptions).toEqual([25, 53])

    wrapper = mountWrapper(activeDelegatesMock(101))
    expect(wrapper.vm.perPageOptions).toEqual([25, 50, 75, 100])
  })

  it('should cap the query limit at 100', () => {
    const wrapper = mountWrapper(activeDelegatesMock(101))
    expect(wrapper.vm.queryParams.limit).toBe(100)
  })

  describe('when the wallet is voting', () => {
    beforeEach(() => {
      walletVote = { username: 'key' }
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
