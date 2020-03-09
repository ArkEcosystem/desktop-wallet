import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { useI18n } from '../../__utils__/i18n'
import router from '@/router'
import PluginManager from '@/pages/PluginManager'

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn()
  }
}))

const localVue = createLocalVue()
const i18n = useI18n(localVue)
localVue.use(VueRouter)

describe('pages > PluginManager', () => {
  const mountPage = () => {
    return mount(PluginManager, {
      localVue,
      router,
      i18n,
      mocks: {
        strings_capitalizeFirst: jest.fn(),
        $store: {
          getters: {
            'plugin/filtered': () => [],
            'session/theme': 'dark',
            'session/pluginMenuOpen': true
          },

          dispatch () {
            //
          }
        }
      }
    })
  }

  it('should have the right name', () => {
    const wrapper = mountPage()
    expect(wrapper.name()).toEqual('PluginManager')
  })

  it('should render component', () => {
    const wrapper = mountPage()
    expect(wrapper.contains('.PluginManager')).toBeTruthy()
  })

  it('should show side menu by default', () => {
    const wrapper = mountPage()
    expect(wrapper.contains('.PluginManagerSideMenu')).toBeTruthy()
  })

  it('should hide side menu from session', () => {
    const wrapper = mountPage()
    wrapper.vm.$store.getters['session/pluginMenuOpen'] = false
    expect(wrapper.contains('.PluginManagerSideMenu')).toBeFalsy()
  })
})
