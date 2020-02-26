import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { PluginManagerTable } from '@/components/PluginManager'

const i18n = useI18nGlobally()
let wrapper

const plugins = [
  { id: 'plugin-enabled' },
  { id: 'plugin-disabled' },
  { id: 'plugin-available' }
]

beforeEach(() => {
  wrapper = mount(PluginManagerTable, {
    i18n,
    mocks: {
      $store: {
        getters: {
          'plugin/isEnabled': jest.fn((pluginId) => pluginId === 'plugin-enabled'),
          'plugin/isInstalled': jest.fn((pluginId) => pluginId === 'plugin-enabled' || pluginId === 'plugin-disabled'),
          'plugin/isUpdateAvailable': jest.fn((pluginId) => pluginId === 'plugin-enabled')
        }
      },
      formatter_bytes: jest.fn()
    },
    propsData: {
      activeCategory: 'all'
    },
    attrs: {
      rows: plugins.map(plugin => ({ ...plugin, categories: ['other'] }))
    },
    sync: false
  })
})

describe('PluginManagerTable', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should include the categories column only if activeCategory is \'all\'', () => {
    expect(wrapper.vm.columns.filter(column => column.field === 'categories')).toHaveLength(1)

    wrapper.setProps({ activeCategory: 'other' })

    expect(wrapper.vm.columns.filter(column => column.field === 'categories')).toHaveLength(0)
  })

  it('should emit sort-change event when clicking on a categories header', () => {
    wrapper.findAll('th').filter(node => node.text() === 'PLUGIN_TABLE.CATEGORY').at(0).trigger('click')
    expect(wrapper.emitted('on-sort-change')).toBeTruthy()
  })

  it('should emit sort-change event when clicking on a status header', () => {
    wrapper.findAll('th').filter(node => node.text() === 'PLUGIN_TABLE.STATUS').at(0).trigger('click')
    expect(wrapper.emitted('on-sort-change')).toBeTruthy()
  })

  describe('Methods', () => {
    it('should emit on-sort-change event', () => {
      wrapper.vm.onSortChange(['foobar'])
      expect(wrapper.emitted('on-sort-change', 'foobar')).toBeTruthy()
    })

    it('should emit show-details event', () => {
      wrapper.vm.emitShowDetails({ id: 'enabled' })
      expect(wrapper.emitted('show-details', plugins[0])).toBeTruthy()
    })

    describe('getStatusText', () => {
      it('should return \'enabled\' for installed and enabled plugins', () => {
        expect(wrapper.vm.getStatusText(plugins[0].id)).toBe('enabled')
      })

      it('should return \'disabled\' for installed and disabled plugins', () => {
        expect(wrapper.vm.getStatusText(plugins[1].id)).toBe('disabled')
      })

      it('should return \'available\' for not installed plugins', () => {
        expect(wrapper.vm.getStatusText(plugins[2].id)).toBe('available')
      })
    })

    describe('isEnabled', () => {
      it('should return true for enabled plugins', () => {
        expect(wrapper.vm.isEnabled(plugins[0].id)).toBeTrue()
      })

      it('should return false for disabled plugins', () => {
        expect(wrapper.vm.isEnabled(plugins[1].id)).toBeFalse()
      })
    })

    describe('isInstalled', () => {
      it('should return true for installed plugins', () => {
        expect(wrapper.vm.isInstalled(plugins[0].id)).toBeTrue()
        expect(wrapper.vm.isInstalled(plugins[1].id)).toBeTrue()
      })

      it('should return false for not installed plugins', () => {
        expect(wrapper.vm.isInstalled(plugins[2].id)).toBeFalse()
      })
    })

    describe('isUpdateAvailable', () => {
      it('should return true if there is an available update', () => {
        expect(wrapper.vm.isUpdateAvailable(plugins[0].id)).toBeTrue()
      })

      it('should return false if there is no available update', () => {
        expect(wrapper.vm.isUpdateAvailable(plugins[1].id)).toBeFalse()
      })
    })
  })
})
