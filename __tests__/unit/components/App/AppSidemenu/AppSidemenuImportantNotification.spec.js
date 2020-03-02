import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import AppSidemenuImportantNotification from '@/components/App/AppSidemenu/AppSidemenuImportantNotification'

const localVue = createLocalVue()
localVue.use(Vuex)

let wrapper

const store = new Vuex.Store({
  modules: {
    updater: {
      namespaced: true,
      getters: {
        availableRelease: () => '0.0'
      }
    }
  }
})

const mockData = {
  $t: () => 'Mock Translaton'
}

const createWrapper = (propsData = {}, mocks = mockData) => {
  wrapper = shallowMount(AppSidemenuImportantNotification, {
    propsData,
    mocks,
    store
  })
}

describe('AppSidemenuImportantNotification', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.contains('.AppSidemenuImportantNotification')).toBeTruthy()
  })

  it('should set notifcation visability state', () => {
    expect(wrapper.vm.isNotificationVisible).toBe(false)
    wrapper.vm.openNotification()
    expect(wrapper.vm.isNotificationVisible).toBe(true)
    wrapper.vm.closeNotification()
    expect(wrapper.vm.isNotificationVisible).toBe(false)
  })
})
