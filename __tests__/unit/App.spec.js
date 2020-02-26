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

describe('App', () => {
  const mountPage = () => {
    return mount(App, {
      localVue,
      router,
      mocks: {
        $store: {
          getters: {
            'session/theme': 'dark'
          }
        }
      }
    })
  }

  it('should have the right name', () => {
    const wrapper = mountPage()
    expect(wrapper.name()).toEqual('DesktopWallet')
  })
})
