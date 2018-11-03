import { shallowMount } from '@vue/test-utils'
import { WalletTransactions } from '@/components/Wallet'

describe('WalletTransactions', () => {
  it('should render', () => {
    const wrapper = shallowMount(WalletTransactions, {
      stubs: {
        'Table': true
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
