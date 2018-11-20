import { shallowMount } from '@vue/test-utils'
import { WalletTransactions } from '@/components/Wallet'

describe('WalletTransactions', () => {
  it('should render', () => {
    const wrapper = shallowMount(WalletTransactions, {
      stubs: {
        'TransactionTable': true
      },
      mocks: {
        $store: {
          getters: {
            'transaction/byAddress': jest.fn(() => [])
          }
        }
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
