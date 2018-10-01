import { shallowMount } from '@vue/test-utils'
import { MarketChartHeader } from '@/components/MarketChart'

const mocks = {
  $store: {
    getters: {
      'session/currency': 'USD',
      'session/currentNetwork': { token: 'ARK' }
    }
  }
}

describe('MarketChartHeader', () => {
  it('should be instantiated', () => {
    const wrapper = shallowMount(MarketChartHeader, {
      provide: {
        changePeriod: jest.fn(),
        getPeriod: () => 'day'
      },
      mocks
    })
    expect(wrapper.isVueInstance()).toBeTrue()
    expect(wrapper.contains('.MarketChartHeader__button'))
  })

  it('should trigger change', done => {
    const wrapper = shallowMount(MarketChartHeader, {
      provide: {
        changePeriod: (period) => {
          expect(period).toBeTruthy()
          done()
        },
        getPeriod: () => 'day'
      },
      mocks
    })
    const find = wrapper.find('.MarketChartHeader__button')
    find.trigger('click')
  })
})
