import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import PluginManagerTable from '@/components/PluginManager/PluginManagerTable'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = shallowMount(PluginManagerTable, {
    i18n,
    mocks: {
      $store: {
        getters: {
          'plugin/isEnabled': jest.fn((pluginId) => pluginId === 'test'),
          'plugin/isInstalled': jest.fn((pluginId) => pluginId === 'test'),
          'plugin/isUpdateAvailable': jest.fn((pluginId) => pluginId === 'test')
        }
      }
    },
    propsData: {
      activeCategory: 'all'
    }
  })
})

describe('PluginManagerTable', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit on-sort-change event', () => {
      wrapper.vm.onSortChange(['foobar'])
      expect(wrapper.emitted('on-sort-change', 'foobar')).toBeTruthy()
    })

    it('should emit show-details event', () => {
      wrapper.vm.emitShowDetails({ id: 'test' })
      expect(wrapper.emitted('show-details', { id: 'test' })).toBeTruthy()
    })

    describe('isEnabled', () => {
      it('should return true for enabled plugins', () => {
        expect(wrapper.vm.isEnabled('test')).toBeTrue()
      })

      it('should return false for disabled plugins', () => {
        expect(wrapper.vm.isEnabled('not-enabled')).toBeFalse()
      })
    })

    describe('isInstalled', () => {
      it('should return true for installed plugins', () => {
        expect(wrapper.vm.isInstalled('test')).toBeTrue()
      })

      it('should return false for not installed plugins', () => {
        expect(wrapper.vm.isInstalled('not-installed')).toBeFalse()
      })
    })

    describe('isUpdateAvailable', () => {
      it('should return true if there is an available update', () => {
        expect(wrapper.vm.isUpdateAvailable('test')).toBeTrue()
      })

      it('should return false if there is no available update', () => {
        expect(wrapper.vm.isUpdateAvailable('no-update')).toBeFalse()
      })
    })
  })
})
