import { shallowMount } from '@vue/test-utils'
import { MarketChart } from '@/components/MarketChart'

const mocks = {
  session_network: {
    market: {
      ticker: 'ARK'
    }
  },
  $store: {
    getters: {
      'session/currency': 'USD',
      'session/network': { token: 'PHANTOM' }
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
