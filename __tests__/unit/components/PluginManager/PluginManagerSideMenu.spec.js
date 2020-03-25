import { mount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { PluginManagerSideMenu } from '@/components/PluginManager'

const i18n = useI18nGlobally()
let wrapper

beforeEach(() => {
  wrapper = mount(PluginManagerSideMenu, {
    i18n,
    mocks: {
      $store: {
        getters: {}
      }
    },
    propsData: {
      activeCategory: 'all'
    }
  })
})

describe('PluginManagerSideMenu', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('Computed properties', () => {
    describe('pluginCategories', () => {
      it('should return plugin categories', () => {
        expect(wrapper.vm.pluginCategories).toEqual(['all', 'gaming', 'utility', 'other'])
      })
    })

    describe('otherCategories', () => {
      it('should return other categories', () => {
        expect(wrapper.vm.otherCategories).toEqual(['theme', 'language'])
      })
    })
  })

  describe('Methods', () => {
    it('should emit toggle event', () => {
      wrapper.vm.emitToggle()
      expect(wrapper.emitted('toggle')).toBeTruthy()
    })

    describe('emitCategory', () => {
      it('should not emit category-change event if category is active category', () => {
        wrapper.vm.emitCategory('all')
        expect(wrapper.emitted('category-change')).toBeFalsy()
      })

      it('should emit category-change event if category is not active category', () => {
        wrapper.vm.emitCategory('gaming')
        expect(wrapper.emitted('category-change', 'gaming')).toBeTruthy()
      })
    })
  })
})
