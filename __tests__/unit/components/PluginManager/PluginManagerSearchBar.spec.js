import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { PluginManagerSearchBar } from '@/components/PluginManager'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = shallowMount(PluginManagerSearchBar, { i18n })
})

describe('PluginManagerSearchBar', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should call emitSearch when query changes', () => {
    jest.spyOn(wrapper.vm, 'emitSearch')
    wrapper.vm.query = 'foobar'
    expect(wrapper.vm.emitSearch).toHaveBeenCalled()
  })

  describe('should emit search event', () => {
    it('when query is falsy', () => {
      wrapper.find('input').setValue(null)
      wrapper.find('input').trigger('input')

      setTimeout(() => {
        expect(wrapper.emitted('search')).toBeTruthy()
      }, 500)

      wrapper.find('input').setValue('')
      wrapper.find('input').trigger('input')

      setTimeout(() => {
        expect(wrapper.emitted('search')).toBeTruthy()
      }, 500)
    })

    it('when query has length 3 or higher', () => {
      wrapper.find('input').setValue('foo')
      wrapper.find('input').trigger('input')

      setTimeout(() => {
        expect(wrapper.emitted('search')).toBeTruthy()
      }, 500)
    })
  })

  describe('should not emit search event', () => {
    it('when query has positive length smaller than 3', () => {
      wrapper.find('input').setValue('no')
      wrapper.find('input').trigger('input')

      setTimeout(() => {
        expect(wrapper.emitted('search')).toBeFalsy()
      }, 500)
    })
  })

  it('should reset the input on escape', () => {
    const query = 'foobar'

    wrapper.find('input').setValue(query)
    expect(wrapper.find('input').element.value).toBe(query)

    wrapper.find('input').trigger('keyup.esc')

    expect(wrapper.vm.query).toBe(null)
  })
})
