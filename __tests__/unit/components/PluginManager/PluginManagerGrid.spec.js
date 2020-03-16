import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { PluginManagerGrid } from '@/components/PluginManager'

const i18n = useI18nGlobally()
let wrapper

const plugins = [
  {
    id: 'test 4',
    title: 'plugin 4'
  },
  {
    id: 'test 3',
    title: 'plugin 3'
  },
  {
    id: 'test 2',
    title: 'plugin 2'
  },
  {
    id: 'test 1',
    title: 'plugin 1'
  },
  {
    id: 'first test',
    title: 'first plugin'
  }
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

  describe('computed', () => {
    it('sortedPlugins', () => {
      expect(wrapper.vm.sortedPlugins[0].title).toBe('first plugin')
      expect(wrapper.vm.sortedPlugins).toEqual([
        plugins[4],
        plugins[3],
        plugins[2],
        plugins[1],
        plugins[0]
      ])
    })
  })
})
