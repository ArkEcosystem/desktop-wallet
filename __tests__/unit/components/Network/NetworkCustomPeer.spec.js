import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { NetworkCustomPeer } from '@/components/Network'

const mocks = {
  $store: {
    getters: {
      'peer/current': jest.fn()
    }
  }
}

Vue.use(Vuelidate)

describe('NetworkCustomPeer', () => {
  it('should render modal', () => {
    const wrapper = shallowMount(NetworkCustomPeer, {
      mocks
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
