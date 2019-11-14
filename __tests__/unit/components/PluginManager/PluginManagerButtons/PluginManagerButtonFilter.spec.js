import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { PluginManagerButtonFilter } from '@/components/PluginManager/PluginManagerButtons'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(PluginManagerButtonFilter, {
    i18n,
    mocks: {
      strings_capitalizeFirst: jest.fn()
    },
    propsData: {
      activeFilter: 'all'
    }
  })
})

describe('PluginManagerButtonFilter', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
