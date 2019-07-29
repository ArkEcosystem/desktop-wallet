import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { MarketChartHeader } from '@/components/MarketChart'

const i18n = useI18nGlobally()

const mocks = {
  $store: {
    getters: {
      'session/currency': 'USD',
      'session/network': { token: 'ARK' },
      'session/marketChartOptions': {
        isEnabled: true,
        isExpanded: true,
        period: 'day'
      }
    }
  }
}

describe('MarketChartHeader', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(MarketChartHeader, {
      i18n,
      provide: {
        getPeriod: () => 'day',
        getIsExpanded: () => true
      },
      mocks
    })
  })

  it('should be instantiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
    expect(wrapper.contains('.MarketChartHeader__button'))
  })

  it('should emit period-change event', () => {
    const find = wrapper.find('.MarketChartHeader__button:enabled')
    find.trigger('click')
    expect(wrapper.emitted('period-change')).toBeTruthy()
  })
})
