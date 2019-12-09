import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginRemovalModal } from '@/components/PluginManager/PluginManagerModals'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = shallowMount(PluginRemovalModal, {
    i18n,
    propsData: {
      plugin: {
        id: 'test',
        permissions: []
      }
    },
    stubs: {
      ListDivided: '<div class="ListDivided" />'
    }
  })
})

describe('PluginRemovalModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should not render divided list if plugin has no STORAGE permission', () => {
    expect(wrapper.vm.hasStorage).toBeFalse()
    expect(wrapper.find('.ListDivided').exists()).toBeFalse()
  })

  it('should render divided list if plugin has STORAGE permission', async() => {
    wrapper.setProps({
      plugin: {
        id: 'test',
        permissions: ['STORAGE']
      }
    })

    expect(wrapper.vm.hasStorage).toBeTrue()
    expect(wrapper.find('.ListDivided').exists()).toBeTrue()
  })

  describe('Methods', () => {
    it('should emit cancel event', () => {
      wrapper.vm.emitCancel()
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('should emit confirm event', () => {
      wrapper.vm.emitConfirm()
      expect(wrapper.emitted('confirm', wrapper.vm.removeOptions)).toBeTruthy()
    })

    it('should toggle removeOptions by method', () => {
      expect(wrapper.vm.removeOptions).toBeFalse()
      wrapper.vm.toggleRemoveOptions()
      expect(wrapper.vm.removeOptions).toBeTrue()
    })
  })
})
