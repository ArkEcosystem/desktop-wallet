import { shallowMount } from '@vue/test-utils'
import { MarketChart } from '@/components/MarketChart'

const mocks = {
  $store: {
    getters: {
      'session/currency': 'USD',
      'session/network': { market: { ticker: 'ARK' }}
    }
  }
}

describe('MarketChart', () => {
  it('should be instantiated', () => {
    const wrapper = shallowMount(MarketChart, {
      mocks
    })

    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
