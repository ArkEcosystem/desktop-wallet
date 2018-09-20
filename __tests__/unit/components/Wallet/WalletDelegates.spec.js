import { shallowMount } from '@vue/test-utils'
import { WalletDelegates } from '@/components/Wallet'

describe('DelegatesTable', () => {
  it('should render', () => {
    const wrapper = shallowMount(WalletDelegates, {
      stubs: {
        'vue-good-table': true
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
