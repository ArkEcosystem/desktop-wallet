import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginDetailsModal } from '@/components/PluginManager/PluginManagerModals'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(PluginDetailsModal, {
    i18n,
    propsData: {
      plugin: {
        id: 'test'
      }
    }
  })
})

describe('PluginDetailsModal', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
