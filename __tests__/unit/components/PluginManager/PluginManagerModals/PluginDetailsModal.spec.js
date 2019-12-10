import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import useI18n from '../../../__utils__/i18n'
import { PluginDetailsModal } from '@/components/PluginManager/PluginManagerModals'

const localVue = createLocalVue()
localVue.use(Vuex)
const i18n = useI18n(localVue)

let wrapper

const actions = {
  setEnabled: jest.fn()
}

const store = new Vuex.Store({
  modules: {
    plugin: {
      namespaced: true,
      actions
    }
  }
})

beforeEach(() => {
  wrapper = mount(PluginDetailsModal, {
    localVue,
    i18n,
    store,
    propsData: {
      plugin: {
        id: 'test',
        version: '0.0.1'
      }
    },
    stubs: {
      Portal: true
    }
  })
})

describe('PluginDetailsModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit close event', () => {
      wrapper.vm.emitClose()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit update event', () => {
      wrapper.vm.emitUpdate()
      expect(wrapper.emitted('update', wrapper.props('plugin'))).toBeTruthy()
    })

    it('should emit remove event', () => {
      wrapper.vm.emitRemove()
      expect(wrapper.emitted('remove', wrapper.props('plugin'))).toBeTruthy()
    })

    it('should emit show-permissions event', () => {
      wrapper.vm.emitShowPermissions()
      expect(wrapper.emitted('show-permissions')).toBeTruthy()
    })

    it('should toggle the status', () => {
      wrapper.vm.toggleStatus(true)
      expect(actions.setEnabled).toHaveBeenCalled()
    })

    it('should report the plugin', () => {
      const arg = 'https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=test&plugin_version=0.0.1'

      jest.spyOn(wrapper.vm, 'electron_openExternal')

      wrapper.vm.reportPlugin()
      expect(wrapper.vm.electron_openExternal).toHaveBeenCalledWith(arg)
    })
  })
})
