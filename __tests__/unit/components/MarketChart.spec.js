import { shallowMount } from '@vue/test-utils'
import { MarketChart, MarketChartButtons } from '@/components/MarketChart'

const mocks = {
  $store: {
    getters: {
      'session/currency': 'USD',
      'session/currentNetwork': { token: 'ARK' }
    }
  }
}

xdescribe('MarketChart', () => {
  it('should be instantiated', () => {
    const wrapper = shallowMount(MarketChart, {
      mocks
    })

    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('MarketChartButtons', () => {
  it('should be instantiated', () => {
    const wrapper = shallowMount(MarketChartButtons, {
      provide: {
        changePeriod: jest.fn(),
        getPeriod: () => 'day'
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
    expect(wrapper.contains('.MarketChartButtons__button'))
  })

  it('should trigger change', done => {
    const wrapper = shallowMount(MarketChartButtons, {
      provide: {
        changePeriod: (period) => {
          expect(period).toBeTruthy()
          done()
        },
        getPeriod: () => 'day'
      }
    })
    const find = wrapper.find('.MarketChartButtons__button')
    find.trigger('click')
  })
})
