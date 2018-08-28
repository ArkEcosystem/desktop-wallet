import { shallowMount } from '@vue/test-utils'
import { InputGrid, InputGridItem, InputGridPopup } from '@/components/InputGrid'

describe('InputGrid', () => {
  const mocks = () => {
    return {
      $t: jest.fn(() => 'translation'),
      $i18n: {
        t: jest.fn(() => 'translation')
      },
      assets_loadImage: jest.fn()
    }
  }

  describe('InputGrid', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGrid, {
        mocks: mocks(),
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.InputGrid')).toBeTruthy()
    })
  })

  describe('InputGridItem', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGridItem, {
        mocks: mocks(),
        propsData: {
          isSelected: false,
          title: 'Example title'
        }
      })

      expect(wrapper.contains('.InputGridItem')).toBeTruthy()
    })
  })

  describe('InputGridPopup', () => {
    it('should render the component', () => {
      const wrapper = shallowMount(InputGridPopup, {
        mocks: mocks(),
        propsData: {
          items: [],
          itemKey: 'src'
        }
      })

      expect(wrapper.contains('.InputGridPopup')).toBeTruthy()
    })
  })
})
