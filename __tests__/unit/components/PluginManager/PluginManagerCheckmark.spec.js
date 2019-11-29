import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { PluginManagerCheckmark } from '@/components/PluginManager'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = shallowMount(PluginManagerCheckmark, { i18n })
})

describe('PluginManagerCheckmark', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should render the official author', () => {
    expect(wrapper.vm.author).toBe('ARK Ecosystem')
  })
})
