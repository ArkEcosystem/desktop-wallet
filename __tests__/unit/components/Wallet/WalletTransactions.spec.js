import { shallowMount } from '@vue/test-utils'
import { WalletTransactions } from '@/components/Wallet'

describe('WalletTransactions', () => {
  it('should render', () => {
    const wrapper = shallowMount(WalletTransactions, {
      stubs: {
        'vue-good-table': true
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
