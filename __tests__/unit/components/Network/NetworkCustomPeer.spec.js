import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { NetworkCustomPeer } from '@/components/Network'

const i18n = useI18nGlobally()

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
      i18n,
      mocks
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
