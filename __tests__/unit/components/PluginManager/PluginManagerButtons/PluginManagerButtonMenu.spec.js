import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginManagerButtonMenu } from '@/components/PluginManager/PluginManagerButtons'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = shallowMount(PluginManagerButtonMenu, {
    i18n,
    propsData: {
      isOpen: true
    }
  })
})

describe('PluginManagerButtonMenu', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should emit click event', () => {
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
