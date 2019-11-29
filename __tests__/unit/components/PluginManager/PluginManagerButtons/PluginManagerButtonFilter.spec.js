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

  it('should open the dropdown when clicked', () => {
    wrapper.find('.PluginManagerButtonFilter').trigger('click')
    expect(wrapper.vm.isOpen).toBeTrue()
    expect(wrapper.find('.PluginManagerButtonFilter__options').isVisible()).toBeTrue()
  })

  it('should close the dropdown when clicked again', () => {
    wrapper.setData({ isOpen: true })

    wrapper.find('.PluginManagerButtonFilter').trigger('click')
    expect(wrapper.vm.isOpen).toBeFalse()
    expect(wrapper.find('.PluginManagerButtonFilter__options').isVisible()).toBeFalse()
  })

  it('should emit filter-change event', () => {
    jest.spyOn(wrapper.vm, 'emitFilterChange')

    wrapper.setData({ isOpen: true })

    wrapper.find('.PluginManagerButtonFilter__options__option').trigger('click')
    expect(wrapper.vm.isOpen).toBeFalse()
    expect(wrapper.vm.emitFilterChange).toHaveBeenCalledWith('all')
    expect(wrapper.emitted('filter-change')).toBeTruthy()
  })
})
