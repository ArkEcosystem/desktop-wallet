import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginDetailsModal } from '@/components/PluginManager/PluginManagerModals'

const i18n = useI18nGlobally()

let wrapper

const mockDispatch = jest.fn()

const mocks = {
  $store: {
    dispatch: mockDispatch,
    getters: {
      'plugin/isAvailable': jest.fn((pluginId) => pluginId === 'test'),
      'plugin/isBlacklisted': jest.fn((pluginId) => pluginId !== 'test'),
      'plugin/isEnabled': jest.fn((pluginId) => pluginId === 'test'),
      'plugin/isInstalled': jest.fn((pluginId) => pluginId === 'test'),
      'plugin/isUpdateAvailable': jest.fn((pluginId) => pluginId !== 'test'),
      'plugin/isInstalledSupported': jest.fn((pluginId) => pluginId === 'test'),
      'plugin/latestVersion': jest.fn((pluginId) => pluginId === '0.0.1')
    }
  }
}

beforeEach(() => {
  mockDispatch.mockReset()

  wrapper = mount(PluginDetailsModal, {
    i18n,
    mocks,
    propsData: {
      plugin: {
        id: 'test',
        version: '0.0.1',
        keywords: ['Keyword'],
        categories: ['utility'],
        permissions: []
      }
    },
    stubs: {
      Portal: '<div><slot /></div>'
    }
  })
})

describe('PluginDetailsModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should render update, delete and report button for installed plugins', () => {
    const buttons = wrapper.findAll('.ButtonIconGeneric')

    expect(buttons.at(0).html().includes('#update')).toBeTrue()
    expect(buttons.at(1).html().includes('#trash')).toBeTrue()
    expect(buttons.at(2).html().includes('#exclamation-mark')).toBeTrue()
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

    it('should emit change-status', () => {
      wrapper.vm.toggleStatus(true)
      expect(wrapper.emitted('change-status', true, wrapper.props('plugin').id)).toBeTruthy()
    })

    it('should report the plugin', () => {
      const arg = 'https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=test&plugin_version=0.0.1'

      jest.spyOn(wrapper.vm, 'electron_openExternal')

      wrapper.vm.reportPlugin()
      expect(wrapper.vm.electron_openExternal).toHaveBeenCalledWith(arg)
    })
  })
})
