import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { ModalPeer } from '@/components/Modal'

const mocks = {
  $store: {
    getters: {
      'peer/current': jest.fn()
    }
  }
}

Vue.use(Vuelidate)

describe('ModalPeer', () => {
  it('should render modal', () => {
    const wrapper = shallowMount(ModalPeer, {
      mocks
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
