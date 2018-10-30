import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { MarketChartHeader } from '@/components/MarketChart'

const i18n = useI18nGlobally()

const mocks = {
  $store: {
    getters: {
      'session/currency': 'USD',
      'session/network': { token: 'ARK' }
    }
  }
}

describe('MarketChartHeader', () => {
  it('should be instantiated', () => {
    const wrapper = shallowMount(MarketChartHeader, {
      i18n,
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
      i18n,
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
