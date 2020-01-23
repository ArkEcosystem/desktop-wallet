import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import PluginManagerGrid from '@/components/PluginManager/PluginManagerGrid'

const i18n = useI18nGlobally()
let wrapper

const plugins = [
  { id: 'test' }
]

beforeEach(() => {
  wrapper = mount(PluginManagerGrid, {
    i18n,
    mocks: {
      $store: {
        getters: {
          'plugin/isInstalled': jest.fn(() => true),
          'plugin/isUpdateAvailable': jest.fn(() => true)
        }
      },
      formatter_bytes: jest.fn()
    },
    propsData: {
      plugins
    }
  })
})

describe('PluginManagerGrid', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit show-details event', () => {
      wrapper.vm.emitShowDetails(plugins[0])
      expect(wrapper.emitted('show-details', plugins[0])).toBeTruthy()
    })
  })
})
