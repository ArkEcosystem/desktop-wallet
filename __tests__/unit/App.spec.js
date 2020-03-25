import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import router from '@/router'
import App from '@/App'

jest.mock('electron', () => ({
  remote: {
    Menu: jest.fn()
  },
  ipcRenderer: {
    on: jest.fn()
  }
}))

const localVue = createLocalVue()
localVue.use(VueRouter)

let wrapper

beforeEach(() => {
  wrapper = mount(App, {
    localVue,
    router,
    mocks: {
      $store: {
        getters: {
          'session/language': 'en-US',
          'session/theme': 'dark',
          'session/profile': {
            id: 'test-profile'
          }
        },
        watch: jest.fn()
      }
    }
  })
})

describe('App', () => {
  it('should have the right name', () => {
    expect(wrapper.name()).toEqual('DesktopWallet')
  })

  describe('Computed properties', () => {
    describe('hasProfile', () => {
      it('should not have a profile', () => {
        wrapper.vm.$store.getters['session/profile'] = undefined
        expect(wrapper.vm.hasProfile).toBe(false)
      })

      it('should have a profile', () => {
        const profileMock = { id: 'test-profile-2' }
        wrapper.vm.$store.getters['session/profile'] = profileMock
        expect(wrapper.vm.hasProfile).toBe(true)
      })
    })
  })
})
