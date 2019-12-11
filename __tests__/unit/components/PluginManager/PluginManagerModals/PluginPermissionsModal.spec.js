import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginPermissionsModal } from '@/components/PluginManager/PluginManagerModals'

const i18n = useI18nGlobally()

let wrapper

const mocks = {
  $store: {
    getters: {
      'plugin/isInstalled': jest.fn(() => true)
    }
  }
}

beforeEach(() => {
  wrapper = mount(PluginPermissionsModal, {
    i18n,
    mocks,
    propsData: {
      plugin: {
        id: 'test',
        version: '0.0.1'
      },
      isUpdate: true
    },
    stubs: {
      Portal: true
    }
  })
})

describe('PluginPermissionsModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit close event', () => {
      wrapper.vm.emitClose()
      expect(wrapper.emitted('close', wrapper.props('modalRef'))).toBeTruthy()
    })

    it('should emit confirm event', () => {
      wrapper.vm.emitConfirm()
      expect(wrapper.emitted('confirm', wrapper.props('plugin'))).toBeTruthy()
    })
  })

  describe('Computed properties', () => {
    describe('title', () => {
      it('should use alternative title if plugin is not installed', () => {
        wrapper.vm.$store.getters['plugin/isInstalled'] = jest.fn(() => false)

        expect(wrapper.vm.title).toBe('MODAL_PLUGIN_PERMISSIONS.ALTERNATIVE_TITLE')
      })

      it('should use alternative title if plugin is installed but is an update', () => {
        wrapper.vm.$store.getters['plugin/isInstalled'] = jest.fn(() => true)
        wrapper.setProps({ isUpdate: true })

        expect(wrapper.vm.title).toBe('MODAL_PLUGIN_PERMISSIONS.ALTERNATIVE_TITLE')
      })

      it('should use title if plugin is installed and is not an update', () => {
        wrapper.vm.$store.getters['plugin/isInstalled'] = jest.fn(() => true)
        wrapper.setProps({ isUpdate: false })

        expect(wrapper.vm.title).toBe('MODAL_PLUGIN_PERMISSIONS.TITLE')
      })
    })
  })
})
