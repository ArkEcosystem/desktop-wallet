import { shallowMount } from '@vue/test-utils'
import { MarketChart } from '@/components/MarketChart'

const mocks = {
  session_network: {
    market: {
      ticker: 'ARK'
    }
  },
  session_profile: {
    timeFormat: 'Default'
  },
  $store: {
    getters: {
      'session/currency': 'USD'
    }
  }
}

const propsData = {
  period: 'day',
  isExpanded: false
}

describe('MarketChart', () => {
  it('should be instantiated', () => {
    const wrapper = shallowMount(MarketChart, {
      mocks,
      propsData
    })

    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should render the chart when isExpanded changes (from false to true)', () => {
    const wrapper = shallowMount(MarketChart, {
      mocks,
      propsData
    })

    jest.spyOn(wrapper.vm, 'renderChart')

    wrapper.setProps({ isExpanded: true })
    expect(wrapper.vm.renderChart).toHaveBeenCalled()
  })

  it('should not render the chart when isExpanded changes (from true to false)', () => {
    const wrapper = shallowMount(MarketChart, {
      mocks,
      propsData: {
        ...propsData,
        isExpanded: true
      }
    })

    jest.spyOn(wrapper.vm, 'renderChart')

    wrapper.setProps({ isExpanded: false })
    expect(wrapper.vm.renderChart).not.toHaveBeenCalled()
  })

  describe('formatHour', () => {
    it('should use the session to return 12h or 24h format', () => {
      let wrapper = shallowMount(MarketChart, {
        mocks,
        propsData
      })

      expect(wrapper.vm.formatHour('11:00')).toEqual('11:00')
      expect(wrapper.vm.formatHour('18:00')).toEqual('18:00')

      mocks.session_profile.timeFormat = '12h'
      wrapper = shallowMount(MarketChart, {
        mocks,
        propsData
      })

      expect(wrapper.vm.formatHour('00:10')).toEqual('12:10 PM')
      expect(wrapper.vm.formatHour('03:00')).toEqual('3:00 AM')
      expect(wrapper.vm.formatHour('11:09')).toEqual('11:09 AM')
      expect(wrapper.vm.formatHour('18:00')).toEqual('6:00 PM')
      expect(wrapper.vm.formatHour('24:05')).toEqual('12:05 PM')

      mocks.session_profile.timeFormat = '24h'
      wrapper = shallowMount(MarketChart, {
        mocks,
        propsData
      })

      expect(wrapper.vm.formatHour('11:00')).toEqual('11:00')
      expect(wrapper.vm.formatHour('18:00')).toEqual('18:00')
    })
  })
})
