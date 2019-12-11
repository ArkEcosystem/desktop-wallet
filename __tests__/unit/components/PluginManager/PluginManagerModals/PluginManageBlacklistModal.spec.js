import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginManageBlacklistModal } from '@/components/PluginManager/PluginManagerModals'
import store from '@/store'

const i18n = useI18nGlobally()

let wrapper

const plugins = [
  'plugin-1',
  'plugin-2'
]

beforeEach(() => {
  wrapper = mount(PluginManageBlacklistModal, {
    i18n,
    store,
    propsData: {
      blacklist: plugins
    },
    stubs: {
      Portal: true
    }
  })

  store.dispatch('plugin/setBlacklisted', {
    scope: 'local',
    plugins
  })
})

describe('PluginManageBlacklistModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit close event', () => {
      wrapper.vm.emitClose()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should remove all plugins from local scope', () => {
      jest.spyOn(wrapper.vm.$store, 'dispatch')

      expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual(wrapper.props('blacklist'))
      wrapper.vm.removeAll()

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalled()
      expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual([])
    })

    it('should remove a single plugin from local scope', () => {
      jest.spyOn(wrapper.vm.$store, 'dispatch')

      expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual(wrapper.props('blacklist'))
      wrapper.vm.removeFromBlacklist(plugins[0])

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalled()
      expect(wrapper.vm.$store.getters['plugin/blacklisted'].local).toEqual([plugins[1]])
    })
  })
})
