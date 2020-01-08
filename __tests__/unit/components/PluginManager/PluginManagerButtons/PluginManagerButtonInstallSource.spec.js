import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginManagerButtonInstallSource } from '@/components/PluginManager/PluginManagerButtons'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = shallowMount(PluginManagerButtonInstallSource, {
    i18n,
    propsData: {
      source: 'url'
    }
  })
})

describe('PluginManagerButtonInstallSource', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should emit click event', () => {
    wrapper.find('.PluginManagerButtonInstallSource').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
