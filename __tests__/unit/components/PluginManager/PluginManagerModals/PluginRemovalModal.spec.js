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
    }
  })
})

describe('PluginRemovalModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
