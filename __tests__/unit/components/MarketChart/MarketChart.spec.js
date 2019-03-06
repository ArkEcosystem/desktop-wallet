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

describe('MarketChart', () => {
  it('should be instantiated', () => {
    const wrapper = shallowMount(MarketChart, {
      mocks
    })

    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('formatHour', () => {
    it('should use the session to return 12h or 24h format', () => {
      let wrapper = shallowMount(MarketChart, {
        mocks
      })

      expect(wrapper.vm.formatHour('11:00')).toEqual('11:00')
      expect(wrapper.vm.formatHour('18:00')).toEqual('18:00')

      mocks.session_profile.timeFormat = '12h'
      wrapper = shallowMount(MarketChart, {
        mocks
      })

      expect(wrapper.vm.formatHour('00:10')).toEqual('12:10 PM')
      expect(wrapper.vm.formatHour('03:00')).toEqual('3:00 AM')
      expect(wrapper.vm.formatHour('11:09')).toEqual('11:09 AM')
      expect(wrapper.vm.formatHour('18:00')).toEqual('6:00 PM')
      expect(wrapper.vm.formatHour('24:05')).toEqual('12:05 PM')

      mocks.session_profile.timeFormat = '24h'
      wrapper = shallowMount(MarketChart, {
        mocks
      })

      expect(wrapper.vm.formatHour('11:00')).toEqual('11:00')
      expect(wrapper.vm.formatHour('18:00')).toEqual('18:00')
    })
  })
})
